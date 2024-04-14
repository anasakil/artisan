const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = async () => {
  mongoServer = new MongoMemoryServer();

  console.log('Starting MongoDB in-memory server...');
  const mongoUri = await mongoServer.getUri();
  console.log(`Connected to MongoDB: ${mongoUri}`);

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  console.log('MongoDB connected.');

  afterAll(async () => {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('MongoDB disconnected.');
  });
};