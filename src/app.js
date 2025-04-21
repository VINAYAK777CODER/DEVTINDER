const express=require("express")
const app=express();
app.use("/login",(req,res)=>{res.end("hello mai login se bhai aapka server run kar raha hai ")}) 
app.use("/test",(req,res)=>{res.end("hello mai test se bhai aapka server run kar raha hai ")}) 

app.use("/",(req,res)=>{res.end("hello mai dashboard se bhai aapka server run kar raha hai ")}) // sabse last me ise


app.listen(3000,()=>{console.log("server is listening on port 3000 ")})