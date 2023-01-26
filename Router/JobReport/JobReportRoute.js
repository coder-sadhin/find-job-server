const express = require("express");
const { ObjectId } = require("mongodb");
const { client2 } = require("../../Db/dbConfig");

const jobsReportRoute = express.Router();

async function run() {
  try {
    const reportJobCollection = client2
      .db("find_a_job")
      .collection("reportJobCollection");
    const jobsCollection = client2
      .db("find_a_job")
      .collection("jobsCollection");
    const reportedCandidateCollection = client2
      .db("find_a_job")
      .collection("reportedCandidate");

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
      const query = { _id: ObjectId(req.params.id) };
      const result = await reportJobCollection.findOne(query);
      res.send(result);
    });
    // delete job and report ////
    jobsReportRoute.delete("/deleteReports", async (req, res) => {
      const jobId = req.body.jobId;
      console.log(req.body);
      const deletReport = await reportJobCollection.deleteOne({ jobId: jobId });
      // const deletjob = await jobsCollection.deleteOne({ _id: ObjectId(jobId) });
      res.send({ name: "delete job and report" });
    });
    jobsReportRoute.get("/isreport", async (req, res) => {
      const query = req.query;
      const search = { repoerterEmail: query.email, jobId: query.jobid };
      const result = await reportJobCollection.findOne(search);
      if (result) {
        res.send({ type: "reported" });
      }

      // console.log(query, "and", search);
      console.log(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

//export this router to use in our index.js
module.exports = jobsReportRoute;
