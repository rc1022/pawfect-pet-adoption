const request = require('supertest');
const app = require('../app');
const { connectDB } = require('../db');

beforeAll( async () => {
    await connectDB();
});

describe('Pet API', () => {
    it('should return a list of pets', async () => {
        const res = await request(app).get('/pets');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('name');
    })
})