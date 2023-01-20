const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const stripe = require("stripe")("sk_test_51M6TOhLZ8s0yewmCKIERlWDqgmuV0dUPMcqr6t68lquLbV9ES0l7wH2zsYyXgZUjwvvhxFeUujmMHDWRGVOZnxSM00E1Hd7kmq");

const PDFDocument = require('pdfkit');
const fs = require("fs");
const candidateDataValidator = require('./validator/candidate.validator');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.send('Find A Job server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('UnAuthorized Access')
    }
    const token = authHeader.split(' ')[1];
    // console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            console.log('token a somossa')
            return res.status(403).send({ Massage: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next()
    })
}

app.post('/user/jwt', (req, res) => {
    const user = (req.body)
    const token = jwt.sign(user, process.env.ACCESS_TOKEN)
    res.send({ token })
    // console.log(user)
})

app.post("/payment/intent", async (req, res) => {
    // console.log('hit')
    try {
        const { amount } = req.body
        const amou = amount * 100
        const paymentIntent = await stripe.paymentIntents.create({
            currency: 'usd',
            amount: amou,
            "payment_method_types": [
                "card"
            ]
        })
        // console.log(paymentIntent)
        res.send({
            success: true,
            message: 'Successfully stripe payment created',
            clientSecret: paymentIntent.client_secret
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            error: error.message
        })
    }
})



async function run() {
    try {
        const usersCollection = client.db("find_a_job").collection("users");

        // other site data 
        const dataUsersCollection = client.db("OldMarket").collection("usersCollection");

        // currency data fetch
        const currencyCollection = client.db("find_a_job").collection("currency");
        const jobsCollection = client.db("find_a_job").collection("jobsCollection");

        // get current user to update subscribetion status
        app.put("/users/subscribe/:email", async(req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    isSubscibed: true
                }
            }
            const result = await usersCollection.updateOne(filter, updatedUser, option)
            res.send({ message: "subscription completed", data: result})
        })
        app.get('/currency', async (req, res) => {
            const query = {}
            const currency = await currencyCollection.find(query).toArray()
            res.send(currency);
        })

        // This is for Find Job 
        app.post('/jobs', async (req, res) => {
            console.log(req.body);
            const jobInfo = req.body;
            const result = await jobsCollection.insertOne(jobInfo);
            res.send(result)
        })

        app.get('/jobs', async (req, res) => {
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

        app.post('/jobs/exp', async (req, res) => {
            const checkItem = req.body;
            const result = await jobsCollection.find({}).toArray();
            console.log(checkItem);

            const filterData = result.filter(job => {
                let filData = checkItem.forEach(item => item.toLowerCase() === job.job_details.experience.toLowerCase())
                console.log(filData);
                return filData
            })
            // console.log(filterData);
            // res.send(filterData)

            // for (const exp of checkItem) {
            //     let filterData = result.filter(job => {
            //         job.job_details.experience === exp;
            //     }
            //     )
            console.log(filterData);

            // }
        })

        // this is user create api 
        app.post('/addUsers', async (req, res) => {
            console.log(req.body);
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // this is for check user type 
        app.get('/checkUser/type', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query)
            if (!user) {
                return res.status(401).send('You Have No account')
            }
            const userType = user.userType;
            // console.log(user)
            res.json(userType);
        })


        // create pdf resume
        app.post("/create-resume", candidateDataValidator ,async (req, res) => {
            try {
                const { firstName, lastName, position, city,state, country , phone, email, portfolio, github, linkedIn } = req.body;

                const { languages, instituteName, projectDescrition, serverCode, clientCode, liveSite, projectName, skills, careerObjective } = req.body

                const doc = await new PDFDocument();

                const fileName = firstName + " " + lastName
                doc.pipe(fs.createWriteStream(`./resumes/${fileName}.pdf`));

                const name = firstName + " " + lastName
                doc
                    .fontSize(25)
                    .font("Helvetica")
                    .text(`${name}`, 50, 50)

                doc
                    .fontSize(20)
                    .text(`${position}`, 50, 75)

                const address = city + ", " + state + ", " + country + "."
                doc
                    .fontSize(14)
                    .text(`Address: ${address}`, 50, 120)
                    .text(`Phone: ${phone}`, 50, 140)

                doc
                    .fontSize(14)
                    .text('My Email Address', 50, 160, {
                        link: `${email}`,
                        underline: true
                    }
                    )

                doc
                    .fontSize(14)
                    .text('My Portfolio', 50, 180, {
                        link: `${portfolio}`,
                        underline: true
                    }
                    )

                doc
                    .fontSize(14)
                    .text('GitHub Profile', 50, 200, {
                        link: `${github}`,
                        underline: true
                    }
                    )

                doc
                    .fontSize(14)
                    .text('LinkedIn Profile', 50, 220, {
                        link: `${linkedIn}`,
                        underline: true,

                    }
                    )

                doc
                    .fontSize(20)
                    .text('CAREER OBJECTIVE', 50, 260)

                    // career oblective
                doc
                    .fontSize(14)
                    .text(`${careerObjective}`, 50, 280)

                // skills
                doc
                    .fontSize(20)
                    .text('SKILLS', 50, 320);

                doc
                    .fontSize(14)
                    .text(`${skills}`, 50, 340)


                // projects
                doc
                    .fontSize(20)
                    .text(`Best Project: ${projectName}`, 50, 435);

                doc
                    .fontSize(16)
                    .text('Live Website', 50, 460, {
                        link: `${liveSite}`,
                        underline: true
                    }
                    )
    
                doc
                    .fontSize(16)
                    .text('Client Side Code', 50, 480, {
                        link: `${clientCode}`,
                        underline: true
                    }
                    )
                doc
                    .fontSize(16)
                    .text('Server Side Code', 50, 500, {
                        link: `${serverCode}`,
                        underline: true
                    }
                    )

                // projects
                doc
                    .fontSize(16)
                    .text(`Description:`, 50, 530)

                    // project dexcripton
                doc
                    .fontSize(14)
                    .text(`${projectDescrition}`, 50, 550)


                // education
                doc
                    .fontSize(20)
                    .text(`Education`, 50, 620)

                doc
                    .fontSize(14)
                    .text(`${instituteName}`, 50, 640);

                // languages
                doc
                    .fontSize(14)
                    .text(`Languages`, 50, 670)
                    .text(`${languages}`, 50, 690)



                // Finalize PDF file
                doc.end();

                // return something
                res.send({ message: "Resume created successfully" })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        })
    }
    finally {

    }

}
run().catch(console.log);


app.listen(port, () => console.log(`find job Server Running on port ${port}`))