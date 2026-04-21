const express=require('express')

const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {displayAllTenants,createAdmin,addTenantMembers}=require('../controllers/tenant.controller')

router.use(auth)
router.get('/',displayAllTenants)

//owner
router.post('/:tenantId/createAdmin',isOwner,createAdmin)
router.post('/:tenantId/add-members',isOwner,isAdmin,addTenantMembers)

module.exports=router