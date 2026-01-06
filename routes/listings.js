const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner,saveRedirectUrl } = require("../middlewares.js");

const listingController = require("../controllers/listings.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        
        return next(
            new ExpressError(400, error.details[0].message)
        );
    }
    console.log("error");
    return next();
};



router.route("/listings")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );


router.get(
    "/listings/new",
    isLoggedIn,
    listingController.newRenderForm
);


router.route("/listings/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


router.get(
    "/listings/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
