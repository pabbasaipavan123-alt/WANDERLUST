const Listing = require("./models/listing");
const Review = require("./models/reviews");


module.exports.isLoggedIn = (req, res, next) => {
    console.log("isLoggedIn hit, headersSent:", res.headersSent);

    if (!req.isAuthenticated()) {
        
        res.locals.redirectUrl = req.path;
        console.log("Not authenticated, redirecting");
        return res.redirect("/login");
    }

    console.log("Authenticated, moving next");
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    return next();
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
    }

    return next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/listings/${id}`);
    }

    return next();
};
