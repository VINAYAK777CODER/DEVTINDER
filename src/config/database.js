const mongoose=require("mongoose")
const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://VINAYAK:SCbVNLk40VLe3rBu@devtindercluster.hx9c4m6.mongodb.net/devTinder");
    // connect your application to your database "connection-url"/devTinder 
}
module.exports=connectDB;
