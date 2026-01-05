const mongoose= require("mongoose");

const initData= require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL= 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
}


main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});


const initDb= async ()=>{
    await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:'6959d6d5dd554a560c3bb296'}))
await Listing.insertMany(initData.data);
console.log("data was inserted");
}

initDb();