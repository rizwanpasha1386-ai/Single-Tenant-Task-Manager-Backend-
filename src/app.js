require("dotenv").config();
const express=require('express')
const cookieParser = require("cookie-parser");

const connectDB=require('./config/Dbconnection')

const AdminUserRoute=require('./routes/admin/user.route')
const AdminProjectRoute=require('./routes/admin/project.route')
const UserProjectRoute=require('./routes/user/project.route')

const AdminRoute=require('./routes/admin.route')
const UserTaskRoute=require('./routes/userTask.route')
const ProjectRoute=require('./routes/projects.routes')
const {auth}=require('./middlewares/auth')
const {isAdmin}=require('./middlewares/admin')
const {login}=require('./controllers/userTask.route')
const adminCreate=require('./admincreate')

const app=express()
app.use(cookieParser());
connectDB()

app.use(express.json())
app.use('/api/admin/users',AdminUserRoute)
app.use('/api/admin/projects',AdminProjectRoute)
app.use('/api/user/projects',UserProjectRoute)


app.use('/api/login',login)
app.use('/api/admin',auth,isAdmin,AdminRoute)
app.use('/api/admin/projects',ProjectRoute)
// app.use("/api/admin/projects/:id/tasks",)
app.use('/api/user',auth,UserTaskRoute)
app.post('/createAdmin',adminCreate)

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})