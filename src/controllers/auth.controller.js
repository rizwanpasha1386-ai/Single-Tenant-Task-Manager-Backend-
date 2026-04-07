require("dotenv").config();
const USER=require('../models/user.model')
const jwt=require('jsonwebtoken')

async function login(req,res) {

    try {

    const {email,password}=req.body
    const user=await USER.findOne({email:email})

    if(!user)return res.status(404).json({msg:"User not found"})

    const isMatch=await user.Comparepassword(password)
    if(!isMatch)
        return res.status(400).json({msg:"Invalid credentials"})
    else
    {
        const SECRET=process.env.SECRET
        const token=jwt.sign({id:user._id, role:user.role },
        SECRET,
        { expiresIn: "1d" })
         res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            samesite:"Strict"
         })
         return res.status(200).json({token:token,msg:"Login success"})
    }
        
    } catch (error) {
        return res.status(500).json({ msg: "Server error" });
    }      
}

module.exports={login}