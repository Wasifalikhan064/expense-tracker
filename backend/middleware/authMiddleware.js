require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async(req, res, next) =>{
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"Not authorized, no token"});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(err){
         res.status(401).json({message:"Not authorized, token failed"});
    }
};

exports.requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.checkRoleAndSetScope = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        
        if (req.user.role === 'admin') {
            req.dataScope = 'all'; 
        } else {
            req.dataScope = 'user'; 
            req.scopedUserId = req.user.id;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};