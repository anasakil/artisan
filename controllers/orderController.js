const Order = require('../models/Order'); 
const Product = require('../models/Product'); 
const User = require('../models/User'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.placeOrder = async (req, res) => {
    try {
        const { products, paymentMethodId } = req.body;

        // Validate request
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products provided' });
        }

        if (!paymentMethodId) {
            return res.status(400).json({ message: 'No payment method provided' });
        }

        const productIds = products.map(item => item.product);
        console.log('Product IDs:', productIds); // Debugging log

        // Fetch product details from the database
        const productDetails = await Product.find({ '_id': { $in: productIds } });

        if (productDetails.length === 0) {
            return res.status(400).json({ message: 'Products not found' });
        }

        console.log('Product Details:', productDetails); // Debugging log

        const sellerId = productDetails[0].seller;
        const seller = await User.findById(sellerId);

        if (!seller || (!seller.stripeAccountId && !seller['stripeAccountId'])) {
            return res.status(404).json({ message: 'Seller not found or not set up for payments' });
        }

        const totalAmount = productDetails.reduce((acc, product) => acc + product.price, 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'usd',
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
            transfer_data: {
                destination: seller.stripeAccountId,
            },
        });

        const order = new Order({
            products: products,
            buyer: req.user._id, 
            seller: sellerId,
            status: 'placed',
            paymentIntentId: paymentIntent.id,
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
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







exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id })
                                  .populate('products.product');

        const totalOrders = orders.length;

        const totalSales = orders.reduce((acc, order) => {
            const orderTotal = order.products.reduce((sum, item) => {
                if (item.product && item.product.price && item.quantity) {
                    return sum + (item.product.price * item.quantity); 
                }
                return sum;
            }, 0);
            return acc + orderTotal;
        }, 0);

        const buyerIds = new Set(orders.map(order => order.buyer.toString()));  
        const totalBuyers = buyerIds.size;

        res.status(200).json({
            totalOrders: totalOrders,
            totalSales: totalSales,
            totalBuyers: totalBuyers,
            orders: orders 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};




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
