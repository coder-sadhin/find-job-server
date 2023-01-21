const { check, validationResult } = require("express-validator");

const candidateDataValidator = [
    check("firstName")
        .notEmpty()
        .withMessage("FirstName is missing"),

    check("lastName")
        .notEmpty()
        .withMessage("LastName is missing"),

    check("careerObjective")
        .notEmpty()
        .withMessage("Career Objective is missing"),

    check("city")
        .notEmpty()
        .withMessage("City is missing"),

    check("postalCode")
        .notEmpty()
        .withMessage("Postal Code is missing"),

    check("state")
        .notEmpty()
        .withMessage("State is missing"),

    check("country")
        .notEmpty()
        .withMessage("Country is missing"),

    check("instituteName")
        .notEmpty()
        .withMessage("Institute Name is missing"),

    check("class")
        .notEmpty()
        .withMessage("Class is missing"),

    check("subject")
        .notEmpty()
        .withMessage("Subject is missing"),

    check("board")
        .notEmpty()
        .withMessage("Board is missing"),

    check("cgpa")
        .notEmpty()
        .withMessage("CGPA is missing"),

    check("skills")
        .notEmpty()
        .withMessage("Skills are missing"),

    check("position")
        .notEmpty()
        .withMessage("Position is missing"),

    check("github")
        .notEmpty()
        .withMessage("GitHub is missing"),

    check("linkedIn")
        .notEmpty()
        .withMessage("LinkedIn is missing"),

    check("portfolio")
        .notEmpty()
        .withMessage("Portfolio is missing"),

    check("phone")
        .notEmpty()
        .withMessage("Phone is missing"),

    check("projectName")
        .notEmpty()
        .withMessage("Project Name is missing"),

    check("liveSite")
        .notEmpty()
        .withMessage("Live Site is missing"),

    check("projectName")
        .notEmpty()
        .withMessage("ProjectName is missing"),

    check("clientCode")
        .notEmpty()
        .withMessage("Client Code is missing"),

    check("serverCode")
        .notEmpty()
        .withMessage("Server Code is missing"),

    check("projectDescrition")
        .notEmpty()
        .withMessage("Project Descrition is missing"),

    check("technologies")
        .notEmpty()
        .withMessage("Technologies are missing"),

    check("languages")
        .notEmpty()
        .withMessage("Languages are missing"),

    (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const errors = error.array().map((err) => err.msg);
            const errorObject = []
            errors.map((err) => errorObject.push({ error: err }));
            console.log(errorObject);
            return res.send(errorObject)
        }
        next()
    }
]

module.exports = candidateDataValidator
