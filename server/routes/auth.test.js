const request = require('supertest');
const app = require('../app');
const { connectDB } = require('../db');

beforeAll(async () => {
    await connectDB();
})

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ email: 'test2@example.com', password: 'Password1' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    it('should not register with invalid email', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ email: 'bademail', password: 'Password1' });
        expect(res.statusCode).toBe(400);
    });

    it('should login successfully', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'Password1' })
        expect(res.statusCode).toBe(200);
    })
});