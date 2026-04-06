const express=require('express')
const {createProject,getAllProjects,getProjectById,updateProject,deleteProject}=require('../../controllers/admin/project.controller')
const AdminMemberRoute=require('./member.route')
const AdminTaskRoute=require('./task.route')
const router=express.Router()
const{isAdmin}=require('../../middlewares/admin')
const{auth}=require('../../middlewares/auth')
const {IsProjectOwner}=require('../../middlewares/isprojectowner')

router.use(auth,isAdmin)
router.post('/',createProject)
router.get('/',getAllProjects)
router.get('/:projectId',IsProjectOwner,getProjectById)
router.patch('/:projectId',IsProjectOwner,updateProject)
router.delete('/:projectId',IsProjectOwner,deleteProject)
router.use('/:projectId/members',IsProjectOwner,AdminMemberRoute)
router.use('/:projectId/tasks',IsProjectOwner,AdminTaskRoute)

module.exports=router