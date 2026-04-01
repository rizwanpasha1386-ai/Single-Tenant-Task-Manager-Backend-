const express=require('express')
const {CreateTask,GetAllTasks,updateTask,deleteTask}=require('../controllers/admin.controller')
const router=express.Router()

router.post("/tasks",CreateTask)
router.get("/tasks",GetAllTasks)
router.put("/tasks/:taskId",updateTask)
router.delete("/tasks/:taskId",deleteTask)

module.exports=router