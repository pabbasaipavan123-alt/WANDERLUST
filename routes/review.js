const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor } = require("../middlewares");

const reviewController = require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};


router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;

    await review.save();
    listing.reviews.push(review);
    await listing.save();

    req.flash("success", "Review Added");
    return res.redirect(`/listings/${id}`);
}))





router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
