const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('../Routes/user.route'); // Adjust path as needed
const User = require('../models/user.model'); // Adjust path as needed

const app = express();
app.use(express.json());
app.use('/api/v1/users', userRoute);

// In-memory MongoDB for testing
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to the in-memory database before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// Clear all test data after every test
afterEach(async () => {
    await User.deleteMany({});
});

// Disconnect from the in-memory database after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User API', () => {
    describe('POST /api/v1/users/signup', () => {
        it('should create a new user and return 201', async () => {
            const res = await request(app)
                .post('/api/v1/users/signup')
                .send({
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.response.success).toBe(true);
            expect(res.body.response.data).toHaveProperty('token');
        });

        it('should return 409 if user already exists', async () => {
            const userData = {
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'jane.doe@example.com',
                password: 'password123',
            };
            await User.create(userData);

            const res = await request(app)
                .post('/api/v1/users/signup')
                .send(userData);
            expect(res.statusCode).toEqual(409);
            expect(res.body.response.success).toBe(false);
        });
    });

    describe('POST /api/v1/users/login', () => {
        it('should login an existing user and return a token', async () => {
            const user = await request(app)
                .post('/api/v1/users/signup')
                .send({
                    first_name: 'Test',
                    last_name: 'User',
                    email: 'test.user@example.com',
                    password: 'password123',
                });

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({
                    email: 'test.user@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data).toHaveProperty('token');
        });

        it('should return 400 for a non-existent user', async () => {
            const res = await request(app)
                .post('/api/v1/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 for incorrect password', async () => {
            await request(app)
                .post('/api/v1/users/signup')
                .send({
                    first_name: 'Another',
                    last_name: 'User',
                    email: 'another.user@example.com',
                    password: 'password123',
                });

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({
                    email: 'another.user@example.com',
                    password: 'wrongpassword',
                });
            expect(res.statusCode).toEqual(400);
        });
    });
});
