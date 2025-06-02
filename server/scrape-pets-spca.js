const puppeteer = require('puppeteer');
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function scrapePetsBySpecies(speciesCode, category) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = `https://www.spca.org.hk/what-we-do/animals-for-adoption/?sel_center&sel_specie=${speciesCode}&num_no`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get all pagination URLs (including the current page)
    const pageUrls = await page.evaluate(() => {
        const urls = [];
        urls.push(window.location.href);
        document.querySelectorAll('.pagination a.page-numbers').forEach(a => {
            urls.push(a.href);
        });
        return Array.from(new Set(urls));
    });

    console.log(`Total pages found for ${category}:`, pageUrls.length);

    let allPets = [];
    for (let i = 0; i < pageUrls.length; i++) {
        const url = pageUrls[i];
        console.log(`Scraping ${category} listing page ${i + 1}: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.col-xl-2.col-lg-3.col-6.text-center.px-4');

        // Get all pet links on this page
        const petLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.col-xl-2.col-lg-3.col-6.text-center.px-4 a')).map(a => a.href);
        });

        for (const link of petLinks) {
            await page.goto(link, { waitUntil: 'networkidle2' });
            await page.waitForSelector('.header-section h1, .box-header h1');
            const petData = await page.evaluate(() => {
                const name = document.querySelector('h1.m-0.p-0')?.innerText.trim() || '';
                const petNumber = document.querySelector('.box-header h6')?.innerText.replace('no.', '').trim() || '';
                const breed = Array.from(document.querySelectorAll('.info-label')).find(el => el.innerText.includes('BREED'))?.parentElement?.childNodes[0]?.textContent.trim() || '';
                const gender = Array.from(document.querySelectorAll('.info-label')).find(el => el.innerText.includes('GENDER'))?.parentElement?.childNodes[0]?.textContent.trim() || '';
                const birthday = Array.from(document.querySelectorAll('.info-label')).find(el => el.innerText.includes('BIRTHDAY'))?.parentElement?.childNodes[0]?.textContent.trim() || '';
                const microchip = Array.from(document.querySelectorAll('.info-label')).find(el => el.innerText.includes('MICROCHIP'))?.parentElement?.childNodes[0]?.textContent.trim() || '';
                const note = document.querySelector('.box-body .col-lg-12 ul li')?.innerText.trim() || '';
                const images = Array.from(document.querySelectorAll('.carousel_wrapper img.img-fluid')).map(img => img.src);
                // Scrape location (centre)
                const centreDiv = Array.from(document.querySelectorAll('.info-label'))
                    .find(el => el.innerText.trim().toUpperCase() === 'CENTRE');
                let location = '';
                if (centreDiv && centreDiv.parentElement) {
                    location = centreDiv.parentElement.childNodes[0]?.textContent.trim() || '';
                }
                // Scrape ABOUT ME (character and description)
                const aboutMeDiv = Array.from(document.querySelectorAll('.col-lg-6 h2'))
                    .find(el => el.innerText.trim().toUpperCase() === 'ABOUT ME');
                let character = '';
                let description = '';
                if (aboutMeDiv && aboutMeDiv.nextSibling) {
                    let text = '';
                    let node = aboutMeDiv.nextSibling;
                    while (node && !(node.nodeName === 'HR')) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += node.textContent;
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                            text += '<br>';
                        }
                        node = node.nextSibling;
                    }
                    const [charPart, ...descParts] = text.split('<br>');
                    character = charPart?.trim() || '';
                    description = descParts.join(' ').replace(/\s+/g, ' ').trim();
                }
                return { name, petNumber, breed, gender, birthday, microchip, note, images, location, character, description };
            });

            // Transform to match MongoDB schema
            function transformPetData(scraped) {
                let age = null;
                if (scraped.birthday) {
                    const birthDate = new Date(scraped.birthday);
                    if (!isNaN(birthDate)) {
                        const diffMs = Date.now() - birthDate.getTime();
                        const ageDate = new Date(diffMs);
                        age = Math.abs(ageDate.getUTCFullYear() - 1970); // in years
                    } else {
                        age = scraped.birthday; // fallback: store as string if not a real date
                    }
                }
                return {
                    name: scraped.name,
                    category: category,
                    gender: scraped.gender,
                    microchip: scraped.microchip,
                    breed: scraped.breed,
                    age: age || scraped.birthday || null,
                    photos: scraped.images,
                    sourceId: scraped.petNumber,
                    sourceName: "SPCA",
                    note: scraped.note,
                    location: scraped.location,
                    character: scraped.character,
                    description: scraped.description,
                    createdAt: new Date()
                };
            }
 
            allPets.push(transformPetData(petData));
        }
    }
    await browser.close();
    return allPets;
}

(async () => {
    try {
        // Scrape both cats and dogs
        const cats = await scrapePetsBySpecies(3, 'cats');
        const dogs = await scrapePetsBySpecies(5, 'dogs');
        const allPets = [...cats, ...dogs];

        // Insert into MongoDB
        const uri = process.env.MONGODB_URI;
        const dbName = 'pawfect';
        const collectionName = 'pets';
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            // Remove only SPCA cats and dogs
            await collection.deleteMany({ sourceName: "SPCA", category: { $in: ["cats", "dogs"] } });
            await collection.insertMany(allPets);
            console.log('All cats and dogs data saved to MongoDB!');
        } finally {
            await client.close();
        }
        console.log('All pages scraped.');
    } catch (err) {
        console.error('Scraping error:', err);
    }
})();
