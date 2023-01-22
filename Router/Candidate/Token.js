const express = require('express');
const { ObjectId } = require("mongodb");
const { client2 } = require('../../Db/dbConfig');

const tokenRoute = express.Router();

async function run() {
    try {
        const usersCollection = client2.db("find_a_job").collection("users");

        tokenRoute.get('/', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email,
            };
            const user = await usersCollection.findOne(query);
            if (!user) {
                return res.status(401).send("You Have No account");
            }
            const token = user.token;
            // console.log(user)
            res.json(token);
        })


    }
    finally {
    }
}
run().catch((err) => console.log(err));


//export this router to use in our index.js
module.exports = tokenRoute;