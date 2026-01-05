const Review=require("../models/reviews.js")
const Listing=require("../models/listing.js")
module.exports.createnewReview=async (req,res)=>{
    console.log(req.body.review);
    
    let result= req.body.review;
    let review=new Review(result);
    review.author=req.user._id;
    let {id}=req.params;
    await review.save();

    let listing=await Listing.findById(id);
    listing.reviews.push(review);
     req.flash("success","Review Added");
    await listing.save();
    res.redirect(`/listings/${id}`);
};
module.exports.destroyReview=async(req,res)=>{
let {id, reviewId}=req.params;
 req.flash("success","Review Deleted");
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`);
};