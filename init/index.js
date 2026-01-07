if(process.NODE_ENV!="production"){
require('dotenv').config({ path: require('path').join(__dirname, "../.env") });
}
const mongoose= require("mongoose");

const initData= require("./data.js");
const Listing = require("../models/listing");
const User=require("../models/user.js");

const MONGO_URL= process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb= async ()=>{
    await Listing.deleteMany({});
    let user= await User.findOne({username:'demo'});
initData.data=initData.data.map((obj)=>({...obj,owner:user._id}))
await Listing.insertMany(initData.data);
console.log("data was inserted");
}

main().then(()=>{
    console.log("connected to db");
    return initDb();
})
.catch((err)=>{
    console.log(err);
});