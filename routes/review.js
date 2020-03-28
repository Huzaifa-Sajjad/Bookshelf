const express = require("express");
const { check, body, validationResult } = require("express-validator");
const authenticate = require("../middleware/auth");
const Review = require("../models/review");

const router = express.Router();

// ROUTE        => POST /api/review
// ACCESS TYPE  => Protected
// Description  => Creates a review
router.post(
  "/",
  authenticate,
  [
    check("title", "Please enter a valid title")
      .not()
      .isEmpty(),
    check("content", "Please enter valid content")
      .not()
      .isEmpty(),
    check("rating", "Please enter a value for rating")
      .not()
      .isEmpty()
      .isNumeric()
  ],
  body("rating").custom(value => {
    if (value < 1 || value > 5) {
      throw new Error("Rating value must be between 1-5");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ errors: errors.array() });
    }

    //No Errors
    const reviewData = {
      title: req.body.title,
      content: req.body.content,
      rating: req.body.rating,
      user: req.user.id
    };

    try {
      //Create a new review and populate it with a user
      let review = new Review(reviewData);
      await review.save();
      return res.json(review);
    } catch (err) {
      return res.status(406).json({ errors: [{ msg: err.msg }] });
    }
  }
);

// ROUTE        => PUT /api/review/:reviewID
// ACCESS TYPE  => Protected
// Description  => updates a review
router.put(
  "/:reviewID",
  authenticate,
  [
    check("title", "Please enter a valid title")
      .not()
      .isEmpty(),
    check("content", "Please enter valid content")
      .not()
      .isEmpty(),
    check("rating", "Please enter a value for rating").isNumeric()
  ],
  body("rating").custom(value => {
    if (value < 1 || value > 5) {
      throw new Error("Rating value must be between 1-5");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ errors: errors.array() });
    }

    //No Errors
    const reviewData = {
      title: req.body.title,
      content: req.body.content,
      rating: req.body.rating,
      user: req.user.id
    };

    try {
      //Find the review and update
      const review = await Review.findOneAndUpdate(
        { _id: req.params.reviewID },
        { $set: reviewData },
        { new: true }
      );
      return res.json({ review });
    } catch (err) {
      return res.status(406).json({ errors: [{ msg: err.msg }] });
    }
  }
);

// ROUTE        => DELETE /api/review/:reviewID
// ACCESS TYPE  => Protected
// Description  => delete a review
router.delete("/:reviewID", authenticate, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewID);
    return res.json({ errors: [{ msg: "Review deleted" }] });
  } catch (err) {
    return res.status(406).json({ errors: [{ msg: err.msg }] });
  }
});

// ROUTE        => GET /api/review
// ACCESS TYPE  => Protected
// Description  => Get all reviews
router.get("/", authenticate, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", ["firstName", "lastName", "email"])
      .exec();

    return res.json({ reviews });
  } catch (err) {
    return res.status(406).json({ errors: [{ msg: err.msg }] });
  }
});

// ROUTE        => GET /api/review/:review_id
// ACCESS TYPE  => Protected
// Description  => Gets review by Id
router.get("/:reviewID", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewID)
      .populate("user", ["firstName", "lastName", "email"])
      .exec();
    return res.json({ review });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: err.msg }] });
  }
});

// ROUTE        => GET /api/review/me/all
// ACCESS TYPE  => Protected
// Description  => Gets reviews of user
router.get("/me/all", authenticate, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("user", ["firstName", "lastName", "email"])
      .exec();
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: err.msg }] });
  }
});

module.exports = router;
