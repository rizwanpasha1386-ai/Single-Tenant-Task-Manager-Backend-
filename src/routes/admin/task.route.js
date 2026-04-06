const express=require('express')
const {CreateTask,GetAllTasks,UpdateTask,DeleteTask,ReassignTask}=require('../../controllers/admin/task.controller')
const route=express.Router({ mergeParams: true })

route.post('/',CreateTask)
route.get('/',GetAllTasks)
route.patch('/:taskId',UpdateTask)
route.delete('/:taskId',DeleteTask)
route.patch('/:taskId/assign',ReassignTask)

module.exports=route