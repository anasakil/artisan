require('dotenv').config();
const express = require('express');
const session = require('express-session'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const swaggerUi = require('swagger-ui-express'); 
const swaggerSpecs = require('./swagger/swaggerSpecs');



connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'Artisannn',
  resave: false,
  saveUninitialized: true
}));




app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // let server;

  // function startServer(port) {
  //     if (!server) {
  //         server = app.listen(port, () => console.log(`Server started on port ${port}`));
  //     }
  //     return server;
  // }
  
  // function stopServer() {
  //     return new Promise((resolve, reject) => {
  //         if (server) {
  //             server.close((err) => {
  //                 if (err) {
  //                     console.error('Failed to close server', err);
  //                     reject(err);
  //                 } else {
  //                     console.log('Server stopped');
  //                     server = null;
  //                     resolve();
  //                 }
  //             });
  //         } else {
  //             resolve(); // If no server to close
  //         }
  //     });
  // }
  
  // module.exports = { app, startServer, stopServer };







const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
