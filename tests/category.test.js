// const request = require('supertest');
// const { app } = require('../server');  
// const mongoose = require('mongoose');

// describe('Category API endpoints', () => {
//     beforeAll(async () => {
//         const url = process.env.MONGO_URI;
//         await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//     });

//     afterAll(async () => {
//         if (mongoose.connection.readyState === 1) {
//             const collections = Object.keys(mongoose.connection.collections);
//             for (const collectionName of collections) {
//                 const collection = mongoose.connection.collections[collectionName];
//                 await collection.drop();
//             }
//             await mongoose.connection.close();
//         }
//     });
    

//     describe('GET /api/category', () => {
//         it('should retrieve all categories', async () => {
//             const res = await request(app).get('/api/category');
//             expect(res.statusCode).toEqual(200);
//             expect(res.body).toBeInstanceOf(Array);
//         });
//     });

 
// });
