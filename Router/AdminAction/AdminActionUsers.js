const express = require('express');
const AdminActionUsers = express.Router();
const { ObjectId } = require("mongodb");
const { client2 } = require("../../Db/dbConfig");

async function run() {
    try {
        const usersCollection = client2.db("find_a_job").collection("users");

        AdminActionUsers.get('/allRecruiter', async (req, res) => {
            const query = {
                userType: "recruiter"
            }
            const result = await usersCollection.find(query).toArray();
            console.log(result)
            res.send(result)
        })

        AdminActionUsers.get('/allCandidate', async (req, res) => {
            const query = {
                userType: "candidate"
            }
            const result = await usersCollection.find(query).toArray();
            console.log(result)
            res.send(result)
        })
    }
    finally {
    }
}
run().catch((err) => console.log(err));
//export this router to use in our index.js
module.exports = AdminActionUsers;