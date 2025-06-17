const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const blogPostRoute = require("../Routes/blogpost.route"); 
const userRoute = require('../Routes/user.route'); 
const BlogPost = require('../models/blogpost.model');
const User = require('../models/user.model'); 
const userMiddleware = require('./middlewares/user.middleware'); 

const app = express();

app.use(express.json());
// We need user routes to log in and get a token
app.use('/api/v1/users', userRoute);
app.use('/api/v1/blogposts', blogPostRoute);


// In-memory MongoDB for testing
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let authToken;
let userId;

// Setup: connect to DB, create a user and get a token
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a user and log in to get a token for protected routes
    const userRes = await request(app)
        .post('/api/v1/users/signup')
        .send({
            first_name: 'Test',
            last_name: 'Author',
            email: 'author@example.com',
            password: 'password123',
        });
    
    userId = userRes.body.response.data.user._id;

    const loginRes = await request(app)
        .post('/api/v1/users/login')
        .send({
            email: 'author@example.com',
            password: 'password123',
        });
    authToken = loginRes.body.response.data.token;
});

// Clear all test data after every test
afterEach(async () => {
    await BlogPost.deleteMany({});
});

// Disconnect from the in-memory database after all tests
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Blog Post API', () => {
    describe('POST /api/v1/blogposts', () => {
        it('should create a new blog post', async () => {
            const res = await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'My First Blog Post',
                    description: 'This is the description of my first blog post.',
                    tags: ['tech', 'testing'],
                    body: 'This is the body of my very first blog post. It is very exciting!',
                    state: 'published'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.response.success).toBe(true);
            expect(res.body.response.data.title).toBe('My First Blog Post');
        });
    });

    describe('GET /api/v1/blogposts', () => {
        it('should return a list of published blog posts', async () => {
            await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'A Published Post',
                    description: 'A post that is published',
                    tags: ['general'],
                    body: 'Some content here.',
                    state: 'published'
                });

            const res = await request(app).get('/api/v1/blogposts');
            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/blogposts/myblogs', () => {
        it('should return the authenticated user\'s blog posts', async () => {
            await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'My Own Post',
                    description: 'This is mine',
                    tags: ['personal'],
                    body: 'Content written by me.',
                    state: 'draft'
                });
    
            const res = await request(app)
                .get('/api/v1/blogposts/myblogs')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].authorId).toBe(userId);
        });
    });
    
    describe('GET /api/v1/blogposts/:id', () => {
        it('should return a single blog post', async () => {
            const post = await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'A Post to Fetch',
                    description: 'Details of a specific post',
                    tags: ['fetch'],
                    body: 'Fetching this post by its ID.',
                    state: 'published'
                });
            const postId = post.body.response.data._id;
            
            const res = await request(app).get(`/api/v1/blogposts/${postId}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data._id).toBe(postId);
            // Check if readCount was incremented
            expect(res.body.response.data.readCount).toBe(1);
        });
    });
    
    describe('PUT /api/v1/blogposts/:id', () => {
        it('should update a blog post', async () => {
            const post = await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updatable Post',
                    description: 'This post will be updated.',
                    tags: ['update'],
                    body: 'Original content.',
                    state: 'draft'
                });
            const postId = post.body.response.data._id;
            
            const res = await request(app)
                .put(`/api/v1/blogposts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Post Title',
                    state: 'published'
                });
    
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.title).toBe('Updated Post Title');
            expect(res.body.data.state).toBe('published');
        });
    });
    
    describe('DELETE /api/v1/blogposts/:id', () => {
        it('should delete a blog post', async () => {
            const post = await request(app)
                .post('/api/v1/blogposts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Deletable Post',
                    description: 'This post will be deleted.',
                    tags: ['delete'],
                    body: 'Content to be deleted.',
                    state: 'draft'
                });
            const postId = post.body.response.data._id;
            
            const res = await request(app)
                .delete(`/api/v1/blogposts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.response.success).toBe(true);
        });
    });
});
