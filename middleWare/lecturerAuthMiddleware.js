const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.lecturerProtect = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.status(401);
        throw new Error("Not authorized, please login");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if(!user){
        res.status(401);
        throw new Error("User not found");
    }
    if(user.role !== "Lecturer"){
        res.status(400);
        throw new Error("User not authorized");
    }
    req.user = user;
    next();
});