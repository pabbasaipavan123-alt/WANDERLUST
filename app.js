// if(process.env.NODE_ENV!="production"){
//     require("dotenv").config();
// }





const MONGO_URL= 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;

const express= require("express");
const app = express();


const Review= require("./models/reviews.js");


const listingsRouter=require("./routes/listings.js")
const reviewsRouter=require("./routes/review.js")
const UsersRouter=require("./routes/user.js")
const mongoose= require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
// const store =MongoStore.create(
//     {
//         mongoUrl:dbUrl,
//         crypto:{
//             secret:"mySuperSecretString"
//         },
//         touchAfter:24*3600
//     }
// );
// store.on("error", (err) => {
// console.log("ERROR in MONGO SESSION STORE",err);
// });
const sessionOptions={
    // store, 
    secret:"mySuperSecretString",
    resave:false,
     saveUninitialized:true,
     cookie:{
        maxAge:7*24*60*60*1000,
        expires:Date.now()*7*24*60*60*1000,
        // httpOnly:true
     },
     

    };



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=> console.log("connected to db"))
.catch(err => console.log(err));
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.currUser=req.user;
    next();
});




app.get("/demoUser",async (req,res)=>{
        let fakeUser=new User({
            email:"student@gmail.com",
            username:"delta-student",
        });
        let registeredUser=await User.register(fakeUser,"helloworld");
            res.send(registeredUser);
});




app.use("/",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);  // here id is with in app.js only
app.use("/",UsersRouter);


app.get("/testListing", wrapAsync(async (req, res) => {
    res.send("successful testing");
}));




app.listen(8080, ()=>{
    console.log("listening on port 8080 ");
});
// 404 handler - should be after all other routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    return res.status(statusCode).render("error.ejs",{err});
});