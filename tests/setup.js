const mongoose = require('mongoose');

beforeAll(async () => {
  const dbConnection = 'mongodb+srv://farawiakil:QE9uMObj1ldNssdo@cluster0.gpmspgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
   await mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
