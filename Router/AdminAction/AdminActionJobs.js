const express = require('express');
const AdminActionJobs = express.Router();
const { ObjectId } = require("mongodb");
const { client2 } = require("../../Db/dbConfig");

async function run() {
    try {
        const usersCollection = client2.db("find_a_job").collection("jobsCollection");

        AdminActionJobs.get('/allJobs', async (req, res) => {
            const result = await usersCollection.find({}).toArray();
            res.send(result)
        })
    }
    finally {
    }
}
run().catch((err) => console.log(err));
//export this router to use in our index.js
module.exports = AdminActionJobs;