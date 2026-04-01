require("dotenv").config();
const USER=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

async function Signup(req,res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        await USER.create({
        name:name,
        email:email,
        password:password
    })
    return res.status(201).json({ msg: "User created successfully" });
    }
    catch(err){
        return res.status(500).json({ msg: "Server error" });
    }   
}

async function login(req,res) {

    try {

    const {email,password}=req.body
    const user=await USER.findOne({email:email})

    if(!user)return res.json({msg:"User not found"})

    const isMatch=await user.Comparepassword(password)
    if(!isMatch)
        return res.status(400).json({msg:"Invalid password"})
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

module.exports={Signup,login}