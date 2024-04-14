const request = require('supertest');
const app = require('../app'); 
const User = require('../models/User');

describe('User Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'user',
        email: 'user@example.com',
        password: '123456',
        role: 'buyer'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should authenticate a user', async () => {
    const user = await User.create({
      username: 'testlogin',
      email: 'login@example.com',
      password: '123456',
      role: 'buyer'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: '123456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

});
