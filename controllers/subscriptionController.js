const asyncHandler = require('express-async-handler');
const stripe = require('../utils/stripeClient'); 
const Subscription = require('../models/Subscription');
const User = require('../models/User'); 

exports.createStripeSubscription = asyncHandler(async (req, res) => {
    const { email, paymentMethodId } = req.body;
    const basicPlanPriceId = 'price_1OwxRuCfxu4Ymg82m2nj6nzw'; 

    try {
        //  Create or retrieve Stripe Customer
        let customers = await stripe.customers.list({ email });
        let customer = customers.data.length > 0 ? customers.data[0] : null;

        if (!customer) {
            customer = await stripe.customers.create({
                email: email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });


        // Create the Stripe Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: basicPlanPriceId }],
            expand: ['latest_invoice.payment_intent'],
        });

        await Subscription.create({
            seller: req.user._id, 
            plan: 'Basic',
            status: subscription.status,
            paymentProcessor: 'Stripe',
            subscriptionId: subscription.id,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        });

        res.json({ 
            message: 'Subscription created successfully.',
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        console.error('Error creating Stripe subscription:', error);
        res.status(500).json({ message: 'Failed to create subscription', error: error.message });
    }
});
