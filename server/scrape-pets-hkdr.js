require('dotenv').config();
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

async function scrapeDogs() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let currentPage = 1;
    let maxPageSeen = 1;
    let visitedPages = new Set();
    let keepGoing = true;  
    const PAGE_LIMIT = 2;
    let pagesScraped = 0;
    

    const allPets = [];
    while (keepGoing) {
        let pageUrl = currentPage === 1
            ? 'https://hongkongdogrescue.com/?post_type=dog&s'
            : `https://hongkongdogrescue.com/page/${currentPage}/?post_type=dog&s`;

        if (visitedPages.has(currentPage)) {
            // Prevent infinite loop in case of pagination bug
            break;
        }
        visitedPages.add(currentPage);
        console.log(`Scraping: ${pageUrl}`);
        await page.goto(pageUrl, { waitUntil: 'networkidle2' });

        // 1. Extract all dog detail links on this page
        const dogLinks = await page.evaluate(() => {
            // Try to get all links to dog detail pages
            // Adjust selector if needed
            return Array.from(document.querySelectorAll('article h4 a.vc_gitem-link')).map(a => a.href);
        });
        console.log(`Found ${dogLinks.length} dogs on this page.`);

        // 2. Visit each dog's detail page and extract info
        for (const dogUrl of dogLinks) {
            try {
                await page.goto(dogUrl, { waitUntil: 'networkidle2' });
                const pet = await page.evaluate(() => {
                    function getTextAfter(str, label) {
                        const idx = str.indexOf(label);
                        if (idx === -1) return '';
                        return str.slice(idx + label.length).split('<br>')[0].replace(':', '').trim();
                    }
                    const name = document.querySelector('h1')?.innerText.trim() || '';
                    const breed = getTextAfter(document.body.innerHTML, 'Breed');
                    const gender = getTextAfter(document.body.innerHTML, 'M/F');
                    const location = getTextAfter(document.body.innerHTML, 'Centre');
                    const ageStr = getTextAfter(document.body.innerHTML, 'Age');
                    const microchip = (document.querySelector('strong')?.innerText.match(/Microchip No.\s*:(.*)/)?.[1] || '').trim();
                    const description = document.querySelector('.dog-content p')?.innerText.trim() || '';
                    const img = document.querySelector('.mainimgbig img')?.src || '';
                    const photos = img ? [img] : [];
                    // Age parsing
                    let age = null;
                    const ageMatch = ageStr.match(/(\d+)\s*Year.*?(\d+)?\s*Month?/i);
                    if (ageMatch) {
                        age = parseInt(ageMatch[1], 10);
                        if (ageMatch[2]) {
                            age += parseInt(ageMatch[2], 10) / 12;
                        }
                    }
                    // Compose a unique sourceId
                    let sourceId = microchip || (name + '-' + location);
                    return {
                        name,
                        category: 'dogs',
                        location,
                        character: '',
                        description,
                        gender,
                        microchip,
                        breed,
                        age,
                        photos,
                        sourceId,
                        sourceName: 'HKDR',
                        note: ''
                    };
                });
                allPets.push(pet);
            } catch (err) {
                console.error(`Failed to scrape dog at ${dogUrl}:`, err);
            }
        }

        // Pagination logic
        const { highestPage, nextPage } = await page.evaluate(() => {
            let max = 1;
            let next = null;
            document.querySelectorAll('#pagination ul li a').forEach(a => {
                const num = parseInt(a.textContent.trim());
                if (!isNaN(num)) max = Math.max(max, num);
                if (a.textContent.trim() === '»') {
                    // Next page link
                    const match = a.href.match(/page\/(\d+)\//);
                    if (match) next = parseInt(match[1]);
                }
            });
            // Also check for current page (in <span>)
            const currentSpan = document.querySelector('#pagination ul li.pager_current span');
            if (currentSpan) {
                const num = parseInt(currentSpan.textContent.trim());
                if (!isNaN(num)) max = Math.max(max, num);
            }
            return { highestPage: max, nextPage: next };
        });
        maxPageSeen = Math.max(maxPageSeen, highestPage);

        pagesScraped++;
        if (pagesScraped >= PAGE_LIMIT) {
            keepGoing = false;
        }

        if (nextPage && nextPage > currentPage) {
            currentPage = nextPage;
        } else if (currentPage < maxPageSeen) {
            // Sometimes there is no nextPage link, but we know there are more pages
            currentPage++;
        } else {
            keepGoing = false;
        }
    }

    await browser.close();
    console.log(`Finished. Highest page found: ${maxPageSeen}`);
    return allPets;
}

(async () => {
    try {
        const dogs = await scrapeDogs();
        const uri = process.env.MONGODB_URI;
        const dbName = 'pawfect';
        const collectionName = 'pets';
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            await collection.deleteMany({ sourceName: "HKDR", category: "dogs"});
            await collection.insertMany(dogs);
            console.log('All dogs saved to MongoDB!');

        } finally {
            await client.close();
        }
        console.log('All pages scraped.')
    } catch (err) {
        console.error('Scraping error:', err)
    }
})();
