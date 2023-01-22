const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// this is for router collections
const { client, client2 } = require("./Db/dbConfig.js");
const create_resume = require("./Router/Candidate/Resume.js");

const userRouter = require("./Router/Users/usersRoute.js");
const jobsRoute = require("./Router/JobsRoute/jobsRoute.js");
const jobApplyRoute = require("./Router/JobApplication/jobApplyRoute.js");
const jobsReportRoute = require("./Router/JobReport/JobReportRoute.js");
const tokenRoute = require("./Router/Candidate/Token.js");
const paymentRoute = require("./Router/Payment/Payments.js");

// this is for testing routing

app.use("/create-resume", create_resume);
app.use("/payment", paymentRoute);
app.use("/user", userRouter);
app.use("/jobs", jobsRoute);
app.use("/apply-job", jobApplyRoute);
app.use("/report", jobsReportRoute);
app.use("/token", tokenRoute);

app.get("/", async (req, res) => {
  res.send("Find A Job server is running");
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("UnAuthorized Access");
  }
  const token = authHeader.split(" ")[1];
  // console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      console.log("token a somossa");
      return res.status(403).send({ Massage: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const usersCollection = client2.db("find_a_job").collection("users");
    // currency data fetch
    const currencyCollection = client2.db("find_a_job").collection("currency");
    const jobsCollection = client2
      .db("find_a_job")
      .collection("jobsCollection");
    const reportJobCollection = client2
      .db("find_a_job")
      .collection("reportJobCollection");
    // const profile = client.db("find_a_job").collection("jobsCollection");

    // get current user to update subscribetion status
    app.put("/users/subscribe/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          isSubscibed: true,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send({ message: "subscription completed", data: result });
    });

    app.get("/currency", async (req, res) => {
      const query = {};
      const currency = await currencyCollection.find(query).toArray();
      res.send(currency);
    });

    // report job by @sarwar ///

    // app.post("/addReport", async (req, res) => {
    //    const reports = req.body;
    //    console.log(reports);
    //    const result = await reportJobCollection.insertOne(reports);
    //    res.send(result);
    // });

    app.put("/jobs/apply/:id", async (req, res) => {
      const candidates = [];
      const candidate = {
        name: req.body.name,
        email: req.body.email,
        candidateId: req.body.candidateId,
      };
      candidates.push(candidate);
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedJob = {
        $set: {
          candidates: candidates,
        },
      };
      const result = await jobsCollection.updateOne(filter, updatedJob, option);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => console.log(`find job Server Running on port ${port}`));
