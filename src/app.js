require("dotenv").config();
const express=require('express')
const cookieParser = require("cookie-parser");
const connectDB=require('./config/Dbconnection')
const AdminUserRoute=require('./routes/admin/user.route')
const AdminProjectRoute=require('./routes/admin/project.route')
const UserProjectRoute=require('./routes/user/project.route')
const LoginRoute=require('./routes/auth.route')
const adminCreate=require('./admincreate')

const app=express()
app.use(cookieParser());
connectDB()

app.use(express.json())
app.use('/api/login',LoginRoute)
app.post('/createAdmin',adminCreate)
app.use('/api/admin/users',AdminUserRoute)
app.use('/api/admin/projects',AdminProjectRoute)
app.use('/api/user/projects',UserProjectRoute)


const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})