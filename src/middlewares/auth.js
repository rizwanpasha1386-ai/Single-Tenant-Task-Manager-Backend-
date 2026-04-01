const jwt=require('jsonwebtoken')
const USER=require('../models/user.model')

async function auth(req,res,next) {
    try {
        const token=req.cookies.token || 
        req.headers.authorization?.split(" ")[1]

        if(!token) return res.status(401).json({msg:"Unauthorized"})
        const decoded=jwt.verify(token,process.env.SECRET)

        const user=await USER.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({ msg: "User no longer exists" });
        }

        req.user=user
        next()
        
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

module.exports={auth}