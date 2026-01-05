const express= require("express");



const router=express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middlewares.js");


const listingController=require("../controllers/listings.js");


// const multer=require("multer");
// const {storage}=require("../cloudConfig.js");
// const upload=multer({storage})

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
   
    if (error ) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};


router.route("/listings")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,wrapAsync(listingController.createListing));

// new Listing
router.route("/listings/new")
.get(isLoggedIn,listingController.newRenderForm);

router.route("/listings/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

router.route("/listings/:id/edit")
.get(isLoggedIn,isOwner, validateListing,wrapAsync(listingController.renderEditForm));



module.exports=router;