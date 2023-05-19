
const asyncHandler = require("express-async-handler");
const Faculty = require("../models/facultyModel");
const Campus = require("../models/campusModel");

exports.createFaculty = asyncHandler(async(req, res, next) => {
    const { name, campus} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Please provide Faculty Name");
    }
    if(!campus){
        res.status(400);
        throw new Error("Please select a Campus");
    }
    const addFaculty = await Faculty.create({
        userId: req.user._id,
        name: name,
        campus:  campus
    });
    if(addFaculty){
        res.status(201).json({message: "Faculty Created Successfully"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again later.");
    }
});


exports.getAllFaculty = asyncHandler(async(req, res, next) => {
    const faculty = await Faculty.find();
    if(faculty){
        res.status(200).json({faculty});
    }else{
        res.status(404);
        throw new Error("Faculty not found");
    }
});
exports.getFacultyByCampus = asyncHandler(async(req, res, next) => {
    const {campus} = req.body;
    
    if(!campus){
        res.status(400);
        throw new Error("Please select a campus");
    }
    //check if campus is valid 
    const verifyCampus = await Campus.findById({_id: campus});
    if(!verifyCampus){
        res.status(400);
        throw new Error("Invalid Campus");
    }
    const faculty = await Faculty.find({campus});
    if(faculty){
        res.status(200).json({faculty});
    }else{
        res.status(404);
        throw new Error("Faculty not found");
    }
});

exports.updateFaculty = asyncHandler(async(req, res, next) => {
    const { name, campus} = req.body;
    const { facultyId } = req.params;

    if(!name){
        res.status(400);
        throw new Error("Please provide Faculty Name");
    }
    if(!campus){
        res.status(400);
        throw new Error("Please select Campus");
    }
    //check if campus is valid 
    const verifyCampus = await Campus.findById({_id: campus});
    if(!verifyCampus){
        res.status(400);
        throw new Error("Invalid Campus");
    }
    //check if faculty is valid
    const faculty = await Faculty.findById({_id: facultyId});
    if(!faculty){
        res.status(400);
        throw new Error("Invalid Faculty");
    }
    faculty.name = name;
    faculty.campus = campus;

    const saveFaculty = await faculty.save();
    if(saveFaculty){
        res.status(200).json({message: "Faculty Updated Successfully"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again");
    }

});

exports.deleteFaculty = asyncHandler(async(req, res, next) => {
   const {facultyId}  = req.params;
   const faculty = await Faculty.findOne({_id: facultyId});
   if(!faculty){
       res.status(404);
       throw new Error("Faculty not found");
   }
   const removeFaculty = await faculty.deleteOne();
   if(removeFaculty){
       res.status(200).json({message: "Faculty successfully deleted"});
   }else{
    res.status(500);
        throw new Error("An error occured, please try again");   
   }
});

exports.updateFacultyStatus = asyncHandler(async(req, res, next) => {
    const {facultyId} = req.params;
    const faculty = await Faculty.findOne({_id: facultyId});
    if(!faculty){
        res.status(404);
        throw new Error("Faculty not found");
    }
    let status = ''
    if(faculty.status === "Active"){
        faculty.status = 'Inactive';
    }else{
        faculty.status = "Active";
    }
     
    const changeStatus = await faculty.save();
    if(changeStatus){
        res.status(200).json({message: "Status Successfully Modified"});
    }else{
        res.status(500);
        throw new Error("An error occcured, try again later");
    }
})