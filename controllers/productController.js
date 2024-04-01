const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Subscription = require('../models/Subscription'); 



exports.listProducts = asyncHandler(async (req, res) => {
    let queryFilter = {};

    if (req.user && req.user.role === 'seller') {
        queryFilter.seller = req.user._id;
    }

    if (req.query.minPrice && req.query.maxPrice) {
        queryFilter.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    } else if (req.query.minPrice) {
        queryFilter.price = { $gte: req.query.minPrice };
    } else if (req.query.maxPrice) {
        queryFilter.price = { $lte: req.query.maxPrice };
    }

    if (req.query.category) {
        queryFilter.category = req.query.category;
    }

    if (req.query.seller) {
        queryFilter.seller = req.query.seller;
    }

    
    if (req.query.name) {
        queryFilter.name = { $regex: req.query.name, $options: 'i' };
    }

    const products = await Product.find(queryFilter);

    res.json(products);
});



exports.createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, imageUrl, category } = req.body;
    
    if (!req.user || req.user.role !== 'seller') {
        res.status(401);
        throw new Error('Not authorized as seller');
    }

    const activeSubscription = await Subscription.findOne({
        seller: req.user._id,
        status: 'active',
        endDate: { $gte: new Date() } 
    });

    if (!activeSubscription) {
        return res.status(403).json({ message: 'Active subscription required to create products' });
    }

    const product = new Product({
        name,
        description,
        price,
        imageUrl,
        category,
        seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});


exports.getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});





exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const userIdString = req.user._id.toString();
    const sellerIdString = product.seller ? product.seller.toString() : '';

    if (userIdString !== sellerIdString) {
        res.status(401);
        throw new Error('Not authorized to update this product');
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.category = req.body.category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});


exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404).send({ message: 'Could not find product' });
     
    }

    if (!req.user || req.user._id.toString() !== product.seller.toString()) {
        res.status(401).send('Not authorized to delete this product');
    }


    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
});
