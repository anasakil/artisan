const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      seller: req.user._id, 
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      { name, description, price, imageUrl, category },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
