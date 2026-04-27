const jwt=require('jsonwebtoken')
const USER=require('../models/user.model')

async function auth(req, res, next) {
    try {
        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ FIXED HERE
        const user = await USER.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ msg: "User no longer exists" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or expired token",
            error: error.message
        });
    }
}


module.exports={auth}