const PROJECT = require('../../models/project.model');
const TASK=require('../../models/tasks.model')
const USER=require('../../models/user.model')
const mongoose=require('mongoose')

async function CreateUser(req,res) {
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

async function GetallUser(params) {
    try {
        const users = await USER.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
}

async function GetAUser(req,res) {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }

        const user = await USER.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

module.exports={CreateUser,GetallUser,GetAUser}