const express = require("express");
const { ObjectId } = require("mongodb");
const { client2 } = require("../../Db/dbConfig");

const jobsReportRoute = express.Router();

async function run() {
    try {
        const reportJobCollection = client2.db("find_a_job").collection("reportJobCollection");
        const jobsCollection = client2.db("find_a_job").collection("jobsCollection");
        jobsReportRoute.post("/addReport", async (req, res) => {
            const reports = req.body;
            const email = reports?.repoerterEmail;
            const jobid = reports?.jobId;
            // console.log(reports);
            const alreadyreported = await reportJobCollection
                .find({
                    repoerterEmail: email,
                })
                .toArray();

            const isReported = alreadyreported.find((repo) => repo.jobId === jobid);
            // console.log("find", isReported);
            if (!isReported) {
                const result = await reportJobCollection.insertOne(reports);
                res.send({ type: "reported" });
            } else {
                res.send({ type: "already reported" });
            }
        });

        // get reported job  / @sarwar /
        jobsReportRoute.get("/reportedJob", async (req, res) => {
            const query = {};
            const reports = await reportJobCollection.find(query).toArray();
            res.send(reports);
        });


        jobsReportRoute.get("/reportedJobDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await reportJobCollection.findOne(query);
            res.send(result);
        });

        // delete job and report ////
        jobsReportRoute.delete("/deleteReports", async (req, res) => {
            const jobId = req.query.id;
            console.log(jobId);
            const deletReport = await reportJobCollection.deleteOne({ jobId: jobId });
            const deletjob = await jobsCollection.deleteOne({ _id: ObjectId(jobId) });
            res.send({ name: "delete job and report" });
        });

    }
    finally {
    }
}
run().catch((err) => console.log(err));

//export this router to use in our index.js
module.exports = jobsReportRoute;
