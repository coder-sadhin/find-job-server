const express = require('express');
const { client2 } = require('../../Db/dbConfig');
const jobApplyRoute = express.Router();
const { ObjectId } = require("mongodb");
async function run() {
    try {
        const appliedJobCollection = client2.db("find_a_job").collection("appliedJobs");
        const usersCollection = client2.db("find_a_job").collection("users");

        jobApplyRoute.post("/", async (req, res) => {
            const application = req.body;
            const query = {
                email: application.candidateEmail
            }
            const findUser = await usersCollection.findOne(query);
            const exsistToken = Number(findUser.token)
            if (!exsistToken > 0) {
                return res.status(407).send("You Have No Token");
            }
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    token: exsistToken - 1,
                },
            };
            const update = await usersCollection.updateOne(
                filter,
                updatedUser,
                option
            );
            const result = await appliedJobCollection.insertOne(application)
            res.send(result)
        })

        jobApplyRoute.get("/:email", async (req, res) => {
            const email = req.params.email
            const jobs = await appliedJobCollection.find({ candidateEmail: email }).toArray()
            res.send(jobs)
        })

        jobApplyRoute.delete("/:id", async (req, res) => {
            const id = req.params.id
            const result = await appliedJobCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })

    }
    finally {
    }
}
run().catch((err) => console.log(err));
//export this router to use in our index.js
module.exports = jobApplyRoute;