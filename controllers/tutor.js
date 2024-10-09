const Tutor = require("../models/tutor.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Tutor Sign In Rought
module.exports.getSigninRought = (req, res) => {
  res.render("tutor/tutor.ejs");
};

// Tutor Rought
module.exports.postSignin = wrapAsync(async (req, res) => {
  try {
    const tutor = req.body.tutor;
    console.log(tutor);

    let registeredTutor = await Tutor.register(tutor, tutor.password);

    req.login(registeredTutor, (err) => {
      if (err) {
        next(err);
      }

      req.flash("success", "Congratulation on becoming a tutor!");
      res.redirect("/courses");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/tutor");
  }
});
