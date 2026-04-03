const express=require('express')
const {CreateUser,CreateTask,GetAllTasks,updateTask,deleteTask,ReassignTask}=require('../controllers/admin.controller')
const { route } = require('./userTask.route')
const router=express.Router()

router.post("/users",CreateUser)
router.post("/tasks",CreateTask)
router.get("/tasks",GetAllTasks)
router.put("/tasks/:taskId",updateTask)
router.delete("/tasks/:taskId",deleteTask)
router.patch("/tasks/:id/assign",ReassignTask)

module.exports=router