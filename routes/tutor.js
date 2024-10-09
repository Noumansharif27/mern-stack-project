const express = require("express");
const router = express.Router();
const tutorControllers = require("../controllers/tutor.js");

// Tutor Sign In Rought
router.get("/tutor", tutorControllers.getSigninRought);

// Tutor Rought
router.post("/tutor", tutorControllers.postSignin);

module.exports = router;
