const mongoose = require('mongoose');
const app = require('../server');
const request = require('supertest');

let server;

beforeAll(() => {
  server = app.listen(3002); // Start server
});

afterAll(async () => {
  server.close(); // Close server
  await mongoose.disconnect(); // Disconnect from the database
});

describe('User Endpoints', () => {
  it('should authenticate a user', async () => {
    const res = await request(server)
      .post('/api/users/login')
      .send({
        email: 'user@example.com',
        password: '123456'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
