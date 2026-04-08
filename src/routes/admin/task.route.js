const express=require('express')
const {CreateTask,GetAllTasks,UpdateTask,DeleteTask,ReassignTask}=require('../../controllers/admin/task.controller')
const route=express.Router({ mergeParams: true })
const {createTaskSchema,updateTaskSchema,reassignTaskSchema,TaskIdParamsSchema}=require('../../validations/task.validation')
const {validate}=require('../../middlewares/validate')

route.post('/',validate(createTaskSchema),CreateTask)
route.get('/',GetAllTasks)
route.patch('/:taskId',validate(TaskIdParamsSchema,"params"),validate(updateTaskSchema),UpdateTask)
route.delete('/:taskId',validate(TaskIdParamsSchema,"params"),DeleteTask)
route.patch('/:taskId/assign',validate(TaskIdParamsSchema,"params"),validate(reassignTaskSchema),ReassignTask)

module.exports=route