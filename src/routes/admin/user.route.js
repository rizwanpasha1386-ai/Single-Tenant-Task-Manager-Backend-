const express=require('express')
const {CreateUser,GetAUser,GetallUser,deleteAUser,updateUser}=require('../../controllers/admin/user.controller')
const {isAdmin}=require('../../middlewares/admin')
const {auth}=require('../../middlewares/auth')
const {validate}=require('../../middlewares/validate')
const {createUserSchema,updateUserSchema,userIdParamSchema}=require('../../validations/user.validation')
const router=express.Router()

router.use(auth,isAdmin)
router.post('/',validate(createUserSchema),CreateUser)
router.get('/',GetallUser)
router.get('/:userId',validate(userIdParamSchema,'params'),GetAUser)
router.delete('/:userId',validate(userIdParamSchema,'params'),deleteAUser)
router.patch('/:userId',validate(userIdParamSchema,'params'),validate(updateUserSchema),updateUser)

module.exports=router