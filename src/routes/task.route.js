const express=require('express')
const {CreateTask,GetAllTasks}=require('../controllers/task.controller')
const router=express.Router()

router.post('/',CreateTask)
router.get('/',GetAllTasks)

module.exports=router
