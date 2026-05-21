const request = require('supertest');
const app = require('../server');
const { pool } = require('../db');

describe('Server Health Check', () => {
  test('GET /health should return server status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });
});

describe('Backend API', () => {
  test('Server should start without errors', () => {
    expect(app).toBeDefined();
  });

  test('Invalid route should return 404', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
  });
});

// Clean up database connection after all tests
afterAll(async () => {
  // Close all client connections
  await pool.end();
});
