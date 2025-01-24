const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isReviewOwner,
  isLogedIn,
  isEligableForReview,
} = require("../utils/middleware.js");
const reviewControllers = require("../controllers/review.js");

// Post Review Rought
router.post(
  "/",
  isLogedIn,
  validateReview,
  isEligableForReview,
  reviewControllers.postReviewRought
);

// Destroy Rought
router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewOwner,
  reviewControllers.destroyRought
);

module.exports = router;
