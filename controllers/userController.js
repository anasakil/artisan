const Product = require('../models/Product');

const userController = {
  filterByPriceRange: async (req, res) => {
    const { minPrice, maxPrice } = req.body;
    try {
      const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  filterByCategorySellerZone: async (req, res) => {
    const { category, seller, zone } = req.body;
    try {
      const products = await Product.find({ category, seller, zone });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  searchByName: async (req, res) => {
    const { name } = req.body;
    try {
      const products = await Product.find({ name: { $regex: name, $options: 'i' } });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = userController;
