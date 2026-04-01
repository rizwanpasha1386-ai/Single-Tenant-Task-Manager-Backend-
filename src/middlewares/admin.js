function isAdmin(req,res,next) {
    
    if(req.user.role!=="admin")
        return res.status(403).json({msg:"Access Denied(Admin only)"})
    next();
}

module.exports={isAdmin}