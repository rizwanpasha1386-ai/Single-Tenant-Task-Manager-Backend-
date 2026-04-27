const MEMBERSHIP=require('../models/membership.model')
async function isAdmin(req,res,next) {
    const tenantId=req.params.tenantId
    const userID=req.user._id
    const membership=await MEMBERSHIP.findOne({
        user:userID,
        tenant:tenantId
    })
    if(!membership)return res.status(403).json({msg:"Not authorized"})
    if(membership.role!=="admin"&&membership.role!=="owner")return res.status(403).json({msg:"Not authorized"})
    next()
}
async function isOwner(req,res,next) {
    const tenantId=req.params.tenantId
    const userID=req.user._id
    const membership=await MEMBERSHIP.findOne({
        user:userID,
        tenant:tenantId
    })
    if(!membership)return res.status(403).json({msg:"Not authorized"})
    if(membership.role!=="owner")return res.status(403).json({msg:"Not authorized"})
    next()
}
async function isMember(req,res,next) {
    const tenantId=req.params.tenantId
    const userID=req.user._id
    const membership=await MEMBERSHIP.findOne({
        user:userID,
        tenant:tenantId
    })
    console.log(membership);
    
    if(!membership)return res.status(403).json({msg:"Not authorized"})
    if(membership.role!=="member")return res.status(403).json({msg:"Not authorized"})
    next()
}

module.exports={isAdmin,isOwner,isMember}