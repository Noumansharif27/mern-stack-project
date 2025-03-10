const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateCourse,
  isLogedIn,
  isCourseOwner,
  isCourseAuthor,
  isStudent,
  hadBuyedAlready,
} = require("../utils/middleware.js");
const courseControlles = require("../controllers/course.js");

router
  .route("/")
  .get(courseControlles.IndexRought) // Index Rought
  .post(isLogedIn, validateCourse, courseControlles.postNewRought); // New Post Rrought

// New Rought
router.get("/new", isLogedIn, courseControlles.getNewRought);

router
  .route("/:courseId")
  .get(courseControlles.showRought) // Show Rought
  .post(hadBuyedAlready, courseControlles.postPurchaseRought) // Post purchase Rought
  .delete(isLogedIn, isCourseOwner, courseControlles.destroyRought); // Destroy Rought

router
  .route("/:courseId/edit")
  .get(isLogedIn, isCourseOwner, courseControlles.getEditRought) // Get Edit Rought
  .post(
    isLogedIn,
    isCourseOwner,
    validateCourse,
    courseControlles.postEditRought
  ); // Edit Post Route

// Get Purchase Route
router.get(
  "/:courseId/purchase",
  isCourseAuthor,
  hadBuyedAlready,
  courseControlles.getPurchaseRought
);

// Get leacture route
router.get(
  "/:courseId/leacture",
  isLogedIn,
  isStudent,
  courseControlles.courseLeactureShowRought
);

module.exports = router;
