const USER=require('../models/user.model')
const bcrypt=require('bcrypt')

async function Signup(req,res) {
    const {name,email,password}=req.body
    
    await USER.create({
        name:name,
        email:email,
        password:password
    })
    res.end("User created successfully")
}

async function login(req,res) {
    const {email,password}=req.body
    const user=await USER.findOne({email:email})

    if(!user)return res.json({msg:"User not found"})

    const isMatch=await user.Comparepassword(password)
    
    if(!isMatch)
        return res.status(400).json({msg:"Invalid password"})
    else
        return res.json({msg:"Login successfully"})
}

module.exports={Signup,login}