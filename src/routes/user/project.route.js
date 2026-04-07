const express=require('express')
const {GetMyProjects,GetAProject}=require('../../controllers/user/project.controller')
const UserTaskRoute=require('./task.route')
const route=express.Router({ mergeParams: true })
const {IsProjectMember}=require('../../middlewares/isprojectmember')
const {auth}=require('../../middlewares/auth')

route.use(auth)
route.get('/',GetMyProjects)
route.get('/:projectId',IsProjectMember,GetAProject)
route.use('/:projectId/tasks',IsProjectMember,UserTaskRoute)

module.exports=route