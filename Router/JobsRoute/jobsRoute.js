const express = require('express');
const { client2 } = require('../../Db/dbConfig');
const { ObjectId } = require("mongodb");

const jobsRoute = express.Router();

async function run() {
    try {
        const jobsCollection = client2.db("find_a_job").collection("jobsCollection");
        const usersCollection = client2.db("find_a_job").collection("users");

        jobsRoute.get('/', async (req, res) => {
            const jobstype = req.query.jobstype;
            const result = await jobsCollection.find({}).toArray();
            console.log(jobstype);
            if (jobstype === "all") {
                res.send(result)
            }
            else {
                const filterData = result.filter(job => job.job_details.job.job_title.toLowerCase().includes(jobstype.toLowerCase()))
                // console.log(filterData);
                res.send(filterData)
            }
        })

        jobsRoute.post("/", async (req, res) => {
            const jobInfo = req.body;
            const query = {
                email: jobInfo.job_details.recruiter_email
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
                query,
                updatedUser,
                option
            );

            const result = await jobsCollection.insertOne(jobInfo);
            res.send(result);
        });

        jobsRoute.get("/jobDetails/:id", async (req, res) => {
            const id = req.params.id;
            const job = await jobsCollection.findOne({ _id: ObjectId(id) });
            res.send(job);
        });

        // delete job
        jobsRoute.delete("/:id", async (req, res) => {
            const id = req.params.id;
            const result = await jobsCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result)
        });
    }
    finally {
    }
}
run().catch((err) => console.log(err));


//export this router to use in our index.js
module.exports = jobsRoute;