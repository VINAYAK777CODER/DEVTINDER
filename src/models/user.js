const mongoose=require("mongoose")
// defining a schema
const userSchema= new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String},
    password:{type:String},
    age:{type:String},
    gender:{type:String}

})
const user=mongoose.model("User",userSchema);
module.exports=user;
// or module.exports=mongoose.model("User",userSchema);