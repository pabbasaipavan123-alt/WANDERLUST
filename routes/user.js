

const express=require('express');

const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const passport = require('passport');
const {saveRedirectUrl}=require("../middlewares.js")
const userController=require("../controllers/users.js");

router.route("/signUp")
.get(userController.renderNewSignUpForm)
.post(wrapAsync(userController.createSignUp));

router.route("/login")
.get(userController.renderNewLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),userController.login);

router.route("/logout")
.get(userController.logout);
module.exports=router;
