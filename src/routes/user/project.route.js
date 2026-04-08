const express=require('express')
const {GetMyProjects,GetAProject}=require('../../controllers/user/project.controller')
const UserTaskRoute=require('./task.route')
const route=express.Router({ mergeParams: true })
const {IsProjectMember}=require('../../middlewares/isprojectmember')
const {auth}=require('../../middlewares/auth')
const {validate}=require('../../middlewares/validate')
const {projectIdParamSchema}=require('../../validations/project.validation')


route.use(auth)
route.get('/',GetMyProjects)
route.get('/:projectId',IsProjectMember,validate(projectIdParamSchema,'params'),GetAProject)
route.use('/:projectId/tasks',IsProjectMember,validate(projectIdParamSchema,'params'),UserTaskRoute)

module.exports=route