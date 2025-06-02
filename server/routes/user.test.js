const request = require('supertest');
const app = require('../app');
const { connectDB } = require('../db');
const { ObjectId } = require('mongodb');

let accessToken, testPetId;

beforeAll( async () => {
    await connectDB();
    await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'Password1'});
    const loginRes = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'Password1' });
    accessToken = loginRes.body.accessToken;

    const { getDB } = require('../db');
    const db = getDB();
    const pet = { name: 'Test Pet', type: 'dog' };
    const result = await db.collection('pets').insertOne(pet);
    testPetId = result.insertedId.toString();
});

describe('User API', () => {
    it('should get user favorites (empty array)', async () => {
        const res = await request(app)
            .get('/user/favorites')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.favorites)).toBe(true);
    });

    it('shoud add a pet to the favorites', async () => {
        const res = await request(app)
            .post('/user/favorites')
            .set('Authorization', `Bearer ${accessToken}`)
            .send( { petId: testPetId })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    })

    it('should remove a pet from the favorites', async () => {
        const res = await request(app)
            .delete(`/user/favorites/${testPetId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    })


})

afterAll(async () => {
    const { getDB } = require('../db');
    const db = getDB();
    await db.collection('users').deleteOne({ email: 'test@example.com'});
    await db.collection('pets').deleteOne({ _id: new ObjectId(testPetId) });
})