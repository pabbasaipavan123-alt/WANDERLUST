const express=require("express");

const router=express.Router({mergeParams:true});


const Review= require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { isLoggedIn,isReviewAuthor,saveRedirectUrl } = require("../middlewares.js");
const reviewController=require("../controllers/reviews.js")

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};



router.route("/")
.post(isLoggedIn,validateReview,wrapAsync(reviewController.createnewReview));

router.route("/:reviewId")
.delete(isLoggedIn,saveRedirectUrl,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;