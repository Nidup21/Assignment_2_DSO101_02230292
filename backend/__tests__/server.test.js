const request = require('supertest');
const app = require('../server');

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
});
