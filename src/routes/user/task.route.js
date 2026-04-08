const express=require('express')
const {getMyTasks,getATask,updateStatus}=require('../../controllers/user/task.controller')
const {statusUpdateTaskSchema,TaskIdParamsSchema}=require('../../validations/task.validation')
const {validate}=require('../../middlewares/validate')
const route=express.Router({ mergeParams: true })

route.get('/',getMyTasks)
route.get('/:taskId',validate(TaskIdParamsSchema,'params'),getATask)
route.patch('/:taskId',validate(TaskIdParamsSchema,'params'),validate(statusUpdateTaskSchema),updateStatus)

module.exports=route