const express=require('express')

const router=express.Router()
const {auth}=require('../middlewares/auth')
const {isAdmin,isMember,isOwner}=require('../middlewares/roles.middleware')
const {createTenant,displayAllTenants,createAdmin,addTenantMembers,updateMemberRole,getTenantMembers,deleteTenantMember,viewTenant,updateTenant,deleteTenant}=require('../controllers/tenant.controller')
const {validate}=require('../middlewares/validate')
const {tenantIdParamSchema}=require('../validations/tenant.validation')

router.use(auth)
router.get('/',displayAllTenants) //?search,role
router.post('/',createTenant)

//owner
router.get('/:tenantId',isOwner,validate(tenantIdParamSchema),viewTenant)
router.patch('/:tenantId',isOwner,validate(tenantIdParamSchema),updateTenant)
router.delete('/:tenantId',isOwner,validate(tenantIdParamSchema),deleteTenant)
router.post('/:tenantId/createAdmin',isOwner,validate(tenantIdParamSchema),createAdmin)
router.post('/:tenantId/add-members',isOwner,validate(tenantIdParamSchema),addTenantMembers)
router.get('/:tenantId/members',isOwner,validate(tenantIdParamSchema),getTenantMembers)  ///members?role=admin,member&search=rizwan&sort=-createdAt
router.delete('/:tenantId/members/:memberId',isOwner,validate(tenantIdParamSchema),deleteTenantMember)
router.patch('/:tenantId/role',isOwner,validate(tenantIdParamSchema),updateMemberRole)

module.exports=router