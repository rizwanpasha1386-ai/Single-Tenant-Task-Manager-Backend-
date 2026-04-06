const express=require('express')
const {getMyTasks,getATask,updateStatus}=require('../../controllers/user/task.controller')
const route=express.Router({ mergeParams: true })

route.get('/',getMyTasks)
route.get('/:taskId',getATask)
route.patch('/:taskId',updateStatus)

module.exports=route