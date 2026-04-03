const express=require('express')
const {CreateUser,CreateTask,GetAllTasks,updateTask,deleteTask}=require('../controllers/admin.controller')
const router=express.Router()

router.post("/createuser",CreateUser)
router.post("/tasks",CreateTask)
router.get("/tasks",GetAllTasks)
router.put("/tasks/:taskId",updateTask)
router.delete("/tasks/:taskId",deleteTask)

module.exports=router