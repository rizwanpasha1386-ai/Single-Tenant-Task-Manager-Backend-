const express=require('express')
const {AddMembers,RemoveMember,GetAllMembers}=require('../../controllers/admin/member.controller')
const route=express.Router({ mergeParams: true })
const {validate}=require('../../middlewares/validate')
const {addMemberSchema,memberIdParamSchema}=require('../../validations/project.validation')

route.post('/',validate(addMemberSchema),AddMembers)
route.delete('/:memberId',validate(memberIdParamSchema,'params'),RemoveMember)
route.get('/',GetAllMembers)

module.exports=route