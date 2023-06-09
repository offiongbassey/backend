const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async(req, res, next) => {
    // try {
        const token = req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error("Not authorized, please login");
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        //get the user id from token
        const user = await User.findById(verified.id).select("-password");
        if(!user){
            res.status(401);
            throw new Error("User not found");
        }
        //get status
        if(user.role !== "Admin"){
            res.status(400);
            throw new Error("User not authorized");
        }
        req.user = user;
        next();
    // } catch (error) {
    //     res.status(401);
    //     throw new Error("Not authorized, please login" + error);
    // }
});