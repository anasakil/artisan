require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');



connectDB();

const app = express();

app.use(express.json());
app.use(bodyParser.json());


app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);






const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
