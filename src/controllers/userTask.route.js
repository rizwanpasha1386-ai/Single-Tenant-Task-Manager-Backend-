const TASK=require('../models/tasks.model')
require("dotenv").config();
const USER=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

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

async function getmytasks(req,res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const mytasks=await TASK.find({assignedTo:req.user._id})
        .sort({ priority: -1 ,createdAt: -1})

        return res.status(200).json({mytasks:mytasks})
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function getATask(req,res) {
    try {
        const task=await TASK.findById(req.params.id)
        if(!task)
            return res.status(404).json({msg:"Task not found"})
        if(task.assignedTo.toString() !== req.user._id.toString())
            return res.status(400).json({msg:"U are only allowed to access your tasks"})
        return res.status(200).json({task:task})
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function updateStatus(req,res) {
    try {
        const {status}=req.body
        const id=req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid task ID" });
        }
        const allowedStatus=["pending","in progress","done"]

        if(!allowedStatus.includes(status)){
            return res.status(404).json({msg:"Invalid status"})
        }

        const task = await TASK.findById(id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        // Authorization check BEFORE update
        if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not authorized" });
        }

        // Update after validation
        task.status = status;
        if(status==="done"){
            task.completedAt = new Date();
        }
        else{
            task.completedAt = null;
        }

        await task.save();

         return res.status(200).json({
            msg: "Task status updated successfully",
            task
        })
    } catch (error) {
        console.error(error);
         return res.status(500).json({ msg: "Server error" })
    }
}

module.exports={getmytasks,getATask,updateStatus,Signup,login}