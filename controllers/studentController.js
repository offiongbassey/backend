const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.updateProfile = asyncHandler(async(req, res, next) => {
    const {firstName, lastName, otherName, photo, phone, bio, address, regNumber, campus, faculty, department, unit} = req.body;
    if(!firstName || !lastName || !phone || !address || !regNumber || !campus || !faculty || !department){
        res.status(401);
        throw new Error("All field is required");
    }
    const user = await User.findById({_id: req.user._id});
    
    user.firstName = firstName;
    user.lastName = lastName;
    user.otherName = otherName;
    user.photo = photo || user.photo;
    user.phone = phone;
    user.bio = bio;
    user.updateStatus = 'Updated',
    user.address = address;
    user.regNumber = regNumber;
    user.campus = campus;
    user.faculty = faculty;
    user.department = department;
    user.unit = unit;

    const saveUser = await user.save();
    if(saveUser){
        res.status(200).json({
            _id: saveUser._id,
            firstName: saveUser.firstName,
            lastName: saveUser.lastName,
            otherName: saveUser.otherName,
            photo: saveUser.photo,
            phone: saveUser.phone,
            bio: saveUser.bio,
            address: saveUser.address,
            regNumber: saveUser.regNumber,
            campus: saveUser.campus,
            faculty: saveUser.faculty,
            department: saveUser.department,
            unit: saveUser.unit,
        });
    }else{
        res.status(500);
        throw new Error("An error occured, please try again later");
    }

});