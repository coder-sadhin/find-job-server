const express = require('express');
const { client2 } = require('../../Db/dbConfig');
const userRouter = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');

async function run() {
    try {
        // this is all collection 
        const usersCollection = client2.db("find_a_job").collection("users");


        userRouter.post("/addUsers", async (req, res) => {
            console.log(req.body);
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


        userRouter.get("/checkUser/type", async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email,
            };
            const user = await usersCollection.findOne(query);
            if (!user) {
                return res.status(401).send("You Have No account");
            }
            const userType = user.userType;
            // console.log(user)
            res.json(userType);
        });

        userRouter.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN);
            res.send({ token });
            // console.log(user)
        });

    }
    finally {
    }
}
run().catch((err) => console.log(err));


//export this router to use in our index.js
module.exports = userRouter;