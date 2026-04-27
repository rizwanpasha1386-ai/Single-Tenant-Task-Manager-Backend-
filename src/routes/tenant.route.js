const express=require('express')

const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {createTenant,displayAllTenants,createAdmin,addTenantMembers}=require('../controllers/tenant.controller')

router.use(auth)
router.get('/',displayAllTenants)
router.post('/',createTenant)

//owner
router.post('/:tenantId/createAdmin',isOwner,createAdmin)
router.post('/:tenantId/add-members',isOwner,addTenantMembers)

module.exports=router