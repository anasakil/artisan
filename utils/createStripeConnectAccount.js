require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createStripeConnectAccount(sellerDetails) {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: sellerDetails.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        console.log(account.id); 
        return account;
    } catch (error) {
        console.error("Failed to create Stripe Connect account", error);
        throw error;
    }
}

// createStripeConnectAccount({ email: 'akil@mail.com' }).then(account => {
//     console.log('Created Stripe Connect account:', account);
// }).catch(error => {
//     console.error('Error:', error);
// });



//--------------------------



// require('dotenv').config();
// const express = require('express');
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// const app = express();
// const PORT = 3000;

// app.get('/start-onboarding', async (req, res) => {
//     try {
//         const accountLink = await stripe.accountLinks.create({
//             account: 'acct_1OzUAGE2ZA7KtbfC',
//             refresh_url: 'https://example.com/reauth',
//             return_url: 'https://example.com/return',
//             type: 'account_onboarding',
//         });

//         res.redirect(accountLink.url);
//     } catch (error) {
//         console.error('Failed to create account link:', error);
//         res.status(500).send('Failed to initiate onboarding.');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });