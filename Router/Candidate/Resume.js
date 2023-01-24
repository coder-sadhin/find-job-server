const express = require("express");
const candidateDataValidator = require("../../validator/candidate.validator");
const router = express.Router();
const fs = require("fs");
const PDFDocument = require("pdfkit");
// router.get('/', function (req, res) {
//     res.send('GET route on things.');
// });
// router.post('/', function (req, res) {
//     res.send('POST route on things.');
// });

router.post("/", candidateDataValidator, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      city,
      state,
      country,
      phone,
      email,
      portfolio,
      github,
      linkedIn,
    } = req.body;

    const {
      languages,
      instituteName,
      projectDescrition,
      serverCode,
      clientCode,
      liveSite,
      projectName,
      skills,
      careerObjective,
    } = req.body;

    const doc = await new PDFDocument();

    const fileName = firstName + " " + lastName;
    doc.pipe(fs.createWriteStream(`./resumes/${fileName}.pdf`));

    const name = firstName + " " + lastName;
    doc.fontSize(25).font("Helvetica").text(`${name}`, 50, 50);

    doc.fontSize(20).text(`${position}`, 50, 75);

    const address = city + ", " + state + ", " + country + ".";
    doc
      .fontSize(14)
      .text(`Address: ${address}`, 50, 120)
      .text(`Phone: ${phone}`, 50, 140);

    doc.fontSize(14).text("My Email Address", 50, 160, {
      link: `${email}`,
      underline: true,
    });

    doc.fontSize(14).text("My Portfolio", 50, 180, {
      link: `${portfolio}`,
      underline: true,
    });

    doc.fontSize(14).text("GitHub Profile", 50, 200, {
      link: `${github}`,
      underline: true,
    });

    doc.fontSize(14).text("LinkedIn Profile", 50, 220, {
      link: `${linkedIn}`,
      underline: true,
    });

    doc.fontSize(20).text("CAREER OBJECTIVE", 50, 260);

    // career oblective
    doc.fontSize(14).text(`${careerObjective}`, 50, 280);

    // skills
    doc.fontSize(20).text("SKILLS", 50, 320);

    doc.fontSize(14).text(`${skills}`, 50, 340);

    // projects
    doc.fontSize(20).text(`Best Project: ${projectName}`, 50, 435);

    doc.fontSize(16).text("Live Website", 50, 460, {
      link: `${liveSite}`,
      underline: true,
    });

    doc.fontSize(16).text("Client Side Code", 50, 480, {
      link: `${clientCode}`,
      underline: true,
    });
    doc.fontSize(16).text("Server Side Code", 50, 500, {
      link: `${serverCode}`,
      underline: true,
    });

    // projects
    doc.fontSize(16).text(`Description:`, 50, 530);

    // project dexcripton
    doc.fontSize(14).text(`${projectDescrition}`, 50, 550);

    // education
    doc.fontSize(20).text(`Education`, 50, 620);

    doc.fontSize(14).text(`${instituteName}`, 50, 640);

    // languages
    doc.fontSize(14).text(`Languages`, 50, 670).text(`${languages}`, 50, 690);
    // Finalize PDF file
    doc.end();

    // return something
    res.send({ message: "Resume created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//export this router to use in our index.js
module.exports = router;
