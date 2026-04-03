require("dotenv").config();
const express=require('express')
const cookieParser = require("cookie-parser");

const connectDB=require('./config/Dbconnection')

const AdminRoute=require('./routes/admin.route')
const UserTaskRoute=require('./routes/userTask.route')
const {auth}=require('./middlewares/auth')
const {isAdmin}=require('./middlewares/admin')

const app=express()
app.use(cookieParser());
connectDB()

app.use(express.json())

app.use('/api/admin',auth,isAdmin,AdminRoute)
app.use('/api/user',auth,UserTaskRoute)

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})