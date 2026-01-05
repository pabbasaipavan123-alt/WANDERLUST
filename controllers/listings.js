
const Listing=require("../models/listing.js")

module.exports.index=async (req,res)=>{
    let listings = await Listing.find({});
    res.render("index.ejs",{ listings });
}
module.exports.newRenderForm=(req,res)=>{
    console.log(req.user);
   
    res.render("Listings/new.ejs");
    
}
module.exports.showListing=async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
   
    if(!listing){
        req.flash("success","Your requested listing Not exists");
        res.redirect("/listings");
    }
    res.render("show.ejs",{ listing });

};

module.exports.createListing=async (req,res)=>{
  
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Listing Added");
    res.redirect("/listings");
};


module.exports.renderEditForm=async(req,res)=>{
    let { id } = req.params;
    
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("success","Listing you required for does not Exist");
        res.redirect("/listings");
    }
   
    res.render("Listings/edit.ejs",{ listing });
};


module.exports.updateListing=async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
     res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let { id } = req.params;
     req.flash("success","Listing Deleted");
    await Listing.findByIdAndDelete(id);
   
    res.redirect("/listings");
};