require("dotenv").config();
const express=require('express')
const connectDB=require('./config/Dbconnection')
const app=express()
const UserRoute=require('./routes/user.route')

connectDB()

app.use(express.json())

app.use('/user',UserRoute)

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})