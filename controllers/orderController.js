const Order = require('../models/Order');
const Product = require('../models/Product');


exports.placeOrder = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.body.products.map(item => item.product) } });
        const sellerId = products[0].seller; 

        const order = new Order({
            products: req.body.products,
            buyer: req.user._id,
            seller: sellerId,
            status: 'placed'
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
};

exports.viewOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order history', error: error.message });
    }
};

// Function for buyer to update their order
exports.updateBuyerOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, buyer: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.save();
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// Function for buyer to delete their order
exports.deleteBuyerOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.orderId, buyer: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};







// Fetch orders for a seller's products
exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};



// Function to update an order for a seller's product
exports.updateSellerOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, seller: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = req.body.status || order.status;
        await order.save();
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};


exports.deleteSellerOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.orderId, seller: req.user._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};
