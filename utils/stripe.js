const stripe = require('stripe')('pk_test_51OwxJtCfxu4Ymg82mxNu47iFlFUcC8fczYRtr9RanMA0BFjzVylCadUYsouLfNcdPd8WIShrSMzsZh8ZtPVVc8Vz00JGq8V45K'); // Replace 'your_secret_key' with your actual secret key

async function createPaymentMethod(paymentMethodData) {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: paymentMethodData.number,
                exp_month: paymentMethodData.exp_month,
                exp_year: paymentMethodData.exp_year,
                cvc: paymentMethodData.cvc,
            },
        });
        return paymentMethod;
    } catch (error) {
        console.error('Error creating PaymentMethod:', error);
        throw error;
    }
}

// Example usage:
const paymentMethodData = {
    number: '4242424242424242',
    exp_month: 8,
    exp_year: 2026,
    cvc: '314',
};

createPaymentMethod(paymentMethodData)
    .then(paymentMethod => {
        console.log('PaymentMethod created:', paymentMethod);
    })
    .catch(error => {
        console.error('Failed to create PaymentMethod:', error);
    });
