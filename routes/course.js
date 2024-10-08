const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateCourse,
  isLogedIn,
  isCourseOwner,
  isCourseAuthor,
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
  .post(courseControlles.postPurchaseRought) // Post purchase Rought
  .delete(isLogedIn, isCourseOwner, courseControlles.destroyRought); // Destroy Rought

router
  .route("/:courseId/edit")
  .get(isLogedIn, isCourseOwner, courseControlles.getEditRought) // Get Edit Rought
  .post(
    isLogedIn,
    isCourseOwner,
    validateCourse,
    courseControlles.postEditRought
  ); // Edit Post Rought

// Get Purchase Rought
router.get(
  "/:courseId/purchase",
  isCourseAuthor,
  courseControlles.getPurchaseRought
);

router.get(
  "/:courseId/leacture",
  isLogedIn,
  courseControlles.courseLeactureShowRought
);

module.exports = router;
