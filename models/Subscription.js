const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sellerName: {
        type: String,
        required: true,
      },
    plan: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'cancelled'],
    },
    paymentProcessor: {
        type: String,
        required: true,
        enum: ['Stripe', 'PayPal'], 
    },
    subscriptionId: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
