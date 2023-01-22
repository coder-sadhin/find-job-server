const express = require('express');
const { client2 } = require('../../Db/dbConfig');
const paymentRoute = express.Router();
const stripe = require("stripe")("sk_test_51M6TOhLZ8s0yewmCKIERlWDqgmuV0dUPMcqr6t68lquLbV9ES0l7wH2zsYyXgZUjwvvhxFeUujmMHDWRGVOZnxSM00E1Hd7kmq");


async function run() {
    try {
        // this is all collection 
        const usersCollection = client2.db("find_a_job").collection("users");
        const paymentCollection = client2.db("find_a_job").collection("paymentCollection");

        paymentRoute.post("/", async (req, res) => {
            const data = req.body;
            const query = {
                email: data.email
            }
            const findUser = await usersCollection.findOne(query);
            const exsistToken = Number(findUser.token)
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    token: exsistToken + (Number(data.token)),
                },
            };
            const update = await usersCollection.updateOne(
                query,
                updatedUser,
                option
            );
            const result = await paymentCollection.insertOne(data)
            res.send(result)
        });

        paymentRoute.post("/intent", async (req, res) => {
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

    }
    finally {
    }
}
run().catch((err) => console.log(err));

module.exports = paymentRoute;