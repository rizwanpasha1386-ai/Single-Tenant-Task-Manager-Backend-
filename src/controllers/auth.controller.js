const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')
const jwt=require('jsonwebtoken')

async function signup(req,res) {
    try {
        const {name,email,password}=req.body
        const user=await USER.create({
            name:name,
            email:email,
            password:password
        })
        res.status(201).json({
            msg:"User created Successfully",
            user
        })
    } catch (error) {
        console.log(error);        
        return res.status(500).json({ msg: "Server error" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await USER.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.Comparepassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { userId: user._id }, // ⚠️ keep consistent with auth middleware
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set cookie
        res.cookie("token", token, {
            httpOnly: true,     // prevents JS access (security)
            secure: false,      // true in production (HTTPS)
            sameSite: "lax",    // or "strict"
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}
module.exports={login,signup}