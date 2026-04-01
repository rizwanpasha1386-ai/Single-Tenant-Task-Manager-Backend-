require("dotenv").config();
const express=require('express')
const cookieParser = require("cookie-parser");

const connectDB=require('./config/Dbconnection')
const UserRoute=require('./routes/user.route')
const TaskRoute=require('./routes/task.route')
const AdminRoute=require('./routes/admin.route')
const {auth}=require('./middlewares/auth')
const {isAdmin}=require('./middlewares/admin')

const app=express()
app.use(cookieParser());
connectDB()

app.use(express.json())

app.use('/user',UserRoute)
app.use('/tasks',TaskRoute)
app.use('/api/admin',auth,isAdmin,AdminRoute)

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})