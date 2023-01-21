const express = require('express');
const router = express.Router();
const stripe = require("stripe")("sk_test_51M6TOhLZ8s0yewmCKIERlWDqgmuV0dUPMcqr6t68lquLbV9ES0l7wH2zsYyXgZUjwvvhxFeUujmMHDWRGVOZnxSM00E1Hd7kmq");


router.post("/", async (req, res) => {
    // console.log('hit')
    try {
        const { amount } = req.body;
        const amou = amount * 100;
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount: amou,
            payment_method_types: ["card"],
        });
        // console.log(paymentIntent)
        res.send({
            success: true,
            message: "Successfully stripe payment created",
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;