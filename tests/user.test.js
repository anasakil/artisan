const request = require('supertest');
const app = require('../server'); 
describe('User Endpoints', () => {
    // it('should create a new user', async () => {
    //     const res = await request(app)
    //         .post('/api/users/register')
    //         .send({
    //             username: 'user',
    //             email: 'usezzr@example.com',
    //             password: '123456',
    //             role: 'buyer'
    //         });
    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body).toHaveProperty('token');
    // });

    it('should authenticate a user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'user@example.com',
                password: '123456'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
