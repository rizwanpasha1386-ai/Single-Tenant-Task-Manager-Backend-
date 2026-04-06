const express=require('express')
const {CreateUser,GetAUser,GetallUser}=require('../../controllers/admin/user.controller')
const {isAdmin}=require('../../middlewares/admin')
const {auth}=require('../../middlewares/auth')
const router=express.Router()

router.use(auth,isAdmin)
router.post('/',CreateUser)
router.get('/',GetallUser)
router.get('/:userId',GetAUser)

module.exports=router