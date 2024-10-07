const request = require('supertest');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = require('./server');

jest.mock('./models/shortUrl');

//Mocking the mongoose connection
jest.mock('mongoose', () => ({
    connect: jest.fn(),
    Schema: jest.fn(() => ({
        full: String,
        short: String
    })),
    model: jest.fn(() => ({
        find: jest.fn(),
        create: jest.fn()
    })),
    connection: {
        on: jest.fn(),
        once: jest.fn(),
        close: jest.fn(),
    },
}));

describe('GET /', () => {
    it('should render the index page with a list of short URLs', async () => {
        ShortUrl.find.mockResolvedValue([{ full: 'http://example.com', short: 'abc123' }]);

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('http://example.com');
        expect(response.text).toContain('abc123');
    });
});

describe('POST /shortUrls', () => {
    it('should create a new short URL and redirect to the main page', async () => {
        ShortUrl.create.mockResolvedValue({ full: 'http://example.com', short: 'abc123' });

        const response = await request(app)
            .post('/shortUrls')
            .send({ fullUrl: 'http://example.com' });

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/');
    });
});