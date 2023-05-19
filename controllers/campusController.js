const asyncHandler = require("express-async-handler");
const Campus = require("../models/campusModel");

exports.createCampus = asyncHandler(async(req, res, next) => {
    const {name} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Please provide Campus Name");
    }
   const addCampus =  await Campus.create({
        userId: req.user._id,
        name: name,
    });
    if(addCampus){
        res.status(201).json({message: "Campus Created Successfully."});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again");
    }
    
});

exports.getCampus = asyncHandler(async(req, res, next) => {

    const campus = await Campus.find();
    if(campus){
        res.status(200).json({campus});
    }else{
        res.status(404);
        throw new Error("Campus not found");
    }
});

exports.updateCampus = asyncHandler(async(req, res, next) => {
    const {name} = req.body;
    const {campusId} = req.params;

    if(!name){
        res.status(400);
        throw new Error("Please provide Campus Name");
    }
    const campus = await Campus.findById({_id: campusId});
    if(!campus){
        res.status(404);
        throw new Error("Campus not found");
    }
    campus.name = name;
    try {
        await campus.save();   
        res.status(200).json({message: "Campus Updated Successfully"});
    } catch (error) {
        res.status(400);
        throw new Error("An error occured, try again");
    }
});

exports.deleteCampus = asyncHandler(async(req, res, next) => {
    const {campusId} = req.params;

    const campus = await Campus.findById({_id: campusId});
    if(!campus){
        res.status(404);
        throw new Error("Campus not found");
    }
    const removeCampus = await campus.deleteOne();
    if(removeCampus){
        res.status(200).json({message: "Campus Deleted Successfully"});
    }else{
        res.status(500);
        throw new Error("An error occcured, try again later");
    }
});

exports.updateCampusStatus = asyncHandler(async(req, res, next) => {
    const {campusId} = req.params;
    const campus = await Campus.findOne({_id: campusId});
    if(!campus){
        res.status(404);
        throw new Error("Campus not found");
    }
    let status = ''
    if(campus.status === "Active"){
        campus.status = 'Inactive';
    }else{
        campus.status = "Active";
    }
     
    const changeStatus = await campus.save();
    if(changeStatus){
        res.status(200).json({message: "Status Successfully Modified"});
    }else{
        res.status(500);
        throw new Error("An error occcured, try again later");
    }

})