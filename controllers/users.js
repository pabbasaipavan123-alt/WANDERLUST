const User=require("../models/user");


module.exports.renderNewSignUpForm=(req,res)=>{
    res.render("./Users/new.ejs");
};


module.exports.createSignUp=async(req,res)=>{
    
    try{let {username,password,email}=req.body;
    const newUser=new User({
        email,username,
    });
   let registeredUser= await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    else{
       req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    }
    })
    
}catch(err){
    res.redirect("/signup");
}
};

module.exports.renderNewLoginForm=(req,res)=>{
    res.render("./Users/login.ejs")
};

module.exports.login=async(req,res)=>{
    let redirectUrl;
    req.flash("success","Welcome to WanderLust you are signed in");
    if(res.locals.redirectUrl){
   redirectUrl=res.locals.redirectUrl;
    }
    else{
   redirectUrl="/listings";
    }

    res.redirect(redirectUrl);
};


module.exports.logout=(req,res,next)=>{
req.logout((err)=>{
    if(err){
        return next(err);
    }
    else{
        req.flash("success","You are logged Out now");
        res.redirect("/listings");
    }
})
};