const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if (req.params.id && req.originalUrl.includes('/reviews')) {
        req.session.redirectUrl = `/listings/${req.params.id}`;
    } else {
        req.session.redirectUrl = req.originalUrl || '/listings';
    }

    if(!req.isAuthenticated()){
        req.flash("success", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    
    let listing=await Listing.findById(id);
    if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)){
        req.flash("success","You are not the Owner of listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author || !review.author.equals(res.locals.currUser._id)){
        req.flash("success","You are not the Author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}