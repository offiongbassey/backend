const asyncHandler = require("express-async-handler");
const Department = require("../models/departmentModel");
const Faculty = require("../models/facultyModel");

exports.createDepartment = asyncHandler(async(req, res, next) => {
    const {name, faculty} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Please provide Department Name");
    }
    if(!faculty){
        res.status(400);
        throw new Error("Please Select Faculty");
    }
    //verify faculty;
    const verifyFaculty = await Faculty.findById({_id: faculty});
    if(!verifyFaculty){
        res.status(404);
        throw new Error("Faculty not found");
    }
    const addDepartment = await Department.create({
        userId: req.user._id,
        name: name,
        faculty: faculty
    });
    if(addDepartment){
        res.status(201).json({message: "Department Successfully Created"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again");
    }


});

exports.getAllDepartments = asyncHandler(async(req, res, next) => {
const department = await Department.find();
if(department){
    res.status(200).json({department});
}else{
    res.status(500);
    throw new Error("No record Found");
}
});

exports.getDepartmentByFaculty = asyncHandler(async(req, res, next) => {
    const {faculty} = req.body;
    const verifyFaculty = await Faculty.findById({_id: faculty});
    if(!verifyFaculty){
        res.status(404);
        throw new Error("Invalid Faculty");
    }
    const department = await Department.find({faculty: faculty});
    if(department){
        res.status(200).json({department});
    }else{
        res.status(500);
        throw new Error("No record Found");
    }
});

exports.updateDepartment = asyncHandler(async(req, res, next) => {
const {name, faculty} = req.body;
const {departmentId} = req.params;
if(!name){
    res.status(400);
    throw new Error("Please provide Department Name");
}
if(!faculty){
    res.status(400);
    throw new Error("Please Select a Faculty");
}
const verifyFaculty = await Faculty.findById({_id: faculty});
if(!verifyFaculty){
    res.status(404);
    throw new Error("Unidentified Faculty");
}
const department = await Department.findById({_id: departmentId});
if(!department){
    res.status(404);
    throw new Error("Unidentified Department");
}
department.name = name;
department.faculty = faculty;
const saveDepartment = await department.save();
if(saveDepartment){
    res.status(200).json({message: "Department Successfully Modified"});
}else{
    res.status(500);
    throw new Error("Sorry, an error occured, please try again");
}

});

exports.deleteDepartment = asyncHandler(async(req, res, next) => {
    const {departmentId} = req.params;
    const department = await Department.findById({_id: departmentId});
    if(!department){
        res.status(404);
        throw new Error("Unidentified Department");
    }
    const removeDepartment = await department.deleteOne();
    if(removeDepartment){
        res.status(200).json({message: "Department Successfully Deleted"});
    }else{
        res.status(500);
        throw new Error("An error occured, pls try again");
    }
});

exports.updateDepartmentStatus = asyncHandler(async(req, res, next) => {
    const {departmentId} = req.params;
    const department = await Department.findOne({_id: departmentId});
    if(!department){
        res.status(404);
        throw new Error("Department not found");
    }
    let status = ''
    if(department.status === "Active"){
        department.status = 'Inactive';
    }else{
        department.status = "Active";
    }
     
    const changeStatus = await department.save();
    if(changeStatus){
        res.status(200).json({message: "Status Successfully Modified"});
    }else{
        res.status(500);
        throw new Error("An error occcured, try again later");
    }
});