const express = require('express');
const { client2 } = require('../../Db/dbConfig');
const jobApplyRoute = express.Router();
async function run() {
    try {
        const appliedJobCollection = client2.db("find_a_job").collection("appliedJobs");

        jobApplyRoute.post("/", async (req, res) => {
            const application = req.body;
            const result = await appliedJobCollection.insertOne(application)
            res.send(result)
        })

        jobApplyRoute.get("/:email", async (req, res) => {
            const email = req.params.email
            const jobs = await appliedJobCollection.find({ candidateEmail: email }).toArray()
            res.send(jobs)
        })

        jobApplyRoute.delete("/applied-job/:id", async (req, res) => {
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