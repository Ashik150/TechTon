import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const processpayment = async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
            company: "GadgetMart",
        },
    });
    //console.log(myPayment);
    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
    });
};

export const stripekey = async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
};
