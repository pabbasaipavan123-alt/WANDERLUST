const { required } = require("joi");
const mongoose=require("mongoose");
const passport=require("passport-local");
const { default: passportLocalMongoose } = require("passport-local-mongoose");


const Schema=mongoose.Schema;



const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
 

});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);


module.exports=User;