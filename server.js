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
app.use(cors()); 
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

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
