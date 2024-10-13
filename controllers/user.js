const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.signin = (req, res) => {
  res.render("user/signin.ejs");
};

module.exports.postSigninRought = wrapAsync(async (req, res, next) => {
  let { username, email, password } = req.body.user;
  let user = new User({ username, email });
  let registeredUser = await User.register(user, password);

  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Welcome at Future Academy!");
    res.redirect("/courses");
  });
});

module.exports.getLoginRought = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.postLoginRought = (req, res) => {
  req.flash("success", "Welcome back to Future Academy!");

  const redirectUrl = res.locals.redirectUrl || "/courses";
  res.redirect(redirectUrl);
};

module.exports.logoutRought = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logout successfully!");
    res.redirect("/courses");
  });
};

module.exports.userCoursesRought = wrapAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate({
    path: "courses",
    populate: {
      path: "author",
    },
  });

  res.render("user/learning.ejs", { user });
});
