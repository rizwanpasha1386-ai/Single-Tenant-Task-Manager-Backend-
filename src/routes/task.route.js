const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {IsProjectMember,IsProjectOwner}=require('../middlewares/project.middleware')
const {CreateTask,GetAllTasks,UpdateTask,DeleteTask,ReassignTask,
    getATask,updateStatus,getMyTasks}=require('../controllers/task.controller')
const {validate}=require('../middlewares/validate')
const {createTaskSchema,updateTaskSchema,statusUpdateTaskSchema,reassignTaskSchema,TaskIdParamsSchema}=require('../validations/task.validation')

router.use(auth)
//admin
router.post('/:tenantId/projects/:projectId/tasks',isAdmin,IsProjectOwner,validate(createTaskSchema),CreateTask)
router.get('/:tenantId/projects/:projectId/tasks',isAdmin,IsProjectOwner,GetAllTasks)
router.patch('/:tenantId/projects/:projectId/tasks/:taskId',isAdmin,IsProjectOwner,validate(TaskIdParamsSchema,"params"),validate(updateTaskSchema),UpdateTask)
router.delete('/:tenantId/projects/:projectId/tasks/:taskId',isAdmin,IsProjectOwner,validate(TaskIdParamsSchema,"params"),DeleteTask)
router.patch('/:tenantId/projects/:projectId/tasks/:taskId/assign',isAdmin,IsProjectOwner,validate(TaskIdParamsSchema,"params"),validate(reassignTaskSchema),ReassignTask)

//member
router.get('/:tenantId/projects/:projectId/my-tasks',isMember,IsProjectMember,getMyTasks)
router.get('/:tenantId/projects/:projectId/tasks/:taskId',isMember,IsProjectMember,validate(TaskIdParamsSchema,'params'),getATask)
router.patch('/:tenantId/projects/:projectId/tasks/:taskId',isMember,IsProjectMember,validate(TaskIdParamsSchema,'params'),validate(statusUpdateTaskSchema),updateStatus)


module.exports=router