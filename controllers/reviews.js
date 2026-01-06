const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createnewReview = async (req, res) => {
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
};


module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    return res.redirect(`/listings/${id}`);
};
