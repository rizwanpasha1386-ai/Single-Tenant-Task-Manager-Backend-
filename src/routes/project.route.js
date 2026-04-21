const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {IsProjectMember,IsProjectOwner}=require('../middlewares/project.middleware')
const {createProjectSchema,updateProjectSchema,addMemberSchema,memberIdParamSchema,projectIdParamSchema}=require('../validations/project.validation')
const {validate}=require('../middlewares/validate')

const {createProject,getAllProjects,getProjectById,updateProject,deleteProject,
    addProjectMembers,RemoveMember,GetAllMembers,
GetMyProjects,GetAProject}=require('../controllers/project.controller')

router.use(auth)
//2>admin
router.post('/:tenantId/projects',isAdmin,validate(createProjectSchema),createProject)
router.get('/:tenantId/projects',isAdmin,getAllProjects)
router.get('/:tenantId/projects/:projectId',isAdmin,IsProjectOwner,validate(projectIdParamSchema,'params'),getProjectById)
router.patch('/:tenantId/projects/:projectId',isAdmin,IsProjectOwner,validate(projectIdParamSchema,'params'),validate(updateProjectSchema),updateProject)
router.delete('/:tenantId/projects/:projectId',isAdmin,IsProjectMember,validate(projectIdParamSchema,'params'),deleteProject)

//project members
router.post('/:tenantId/projects/:projectId/members',isAdmin,IsProjectOwner,validate(projectIdParamSchema,'params'),validate(addMemberSchema),addProjectMembers)
router.delete('/:tenantId/projects/:projectId/members/:memberId',isAdmin,IsProjectOwner,validate(projectIdParamSchema,'params'),validate(memberIdParamSchema,'params'),RemoveMember)
router.get('/:tenantId/projects/:projectId/members',isAdmin,IsProjectOwner,validate(projectIdParamSchema,'params'),GetAllMembers)

//member access
router.get('/:tenantId/my-projects',isMember,GetMyProjects)
router.get('/:tenantId/my-projects/:projectId',isMember,IsProjectMember,validate(projectIdParamSchema,'params'),GetAProject)

module.exports=router