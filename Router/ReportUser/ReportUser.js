const express = require("express");
const { ObjectId } = require("mongodb");
const { client2 } = require("../../Db/dbConfig");

const ReportUsersRoute = express.Router();

async function run() {
    try {
        const reportUsersCollection = client2.db("find_a_job").collection("reportUsers");
        const usersCollection = client2.db("find_a_job").collection("users");

        ReportUsersRoute.get("/reportedRecruiter", async (req, res) => {
            const query = { userType: "recruiter" };
            const currency = await usersCollection.find(query).toArray();
            res.send(currency);
        });

        ReportUsersRoute.get("/reportedCandidate", async (req, res) => {
            const query = { userType: "candidate" };
            const currency = await usersCollection.find(query).toArray();
            res.send(currency);
        });


    }
    finally {
    }
}
run().catch((err) => console.log(err));

//export this router to use in our index.js
module.exports = ReportUsersRoute;