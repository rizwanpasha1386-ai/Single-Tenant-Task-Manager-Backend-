const express=require('express')
const {AddMembers,RemoveMember,GetAllMembers}=require('../../controllers/admin/member.controller')
const route=express.Router({ mergeParams: true })

route.post('/',AddMembers)
route.delete('/:memberId',RemoveMember)
route.get('/',GetAllMembers)

module.exports=route