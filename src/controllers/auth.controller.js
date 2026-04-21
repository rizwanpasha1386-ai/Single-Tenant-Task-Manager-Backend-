const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')

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
        return res.status(500).json({ msg: "Server error" });
    }
}

async function login(req,res) {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await USER.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 3. Compare password using schema method
        const isMatch = await user.Comparepassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Response
        res.status(200).json({
            message: "Login successful",
            token,
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