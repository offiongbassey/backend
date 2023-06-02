const asyncHandler = require("express-async-handler");
const Bank = require("../models/bankModel");

exports.createBank = asyncHandler(async(req, res, next) => {
    const {name, code} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Bank Name is required");
    }
    if(!code){
        res.status(400);
        throw new Error("Bank Code is required")
    }
    const addBank = await Bank.create({
        userId: req.user._id,
        name,
        code,
        status: "Active"
    });
    if(addBank){
        res.status(201).json({message: "Bank Created Successfully"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again later")
    }
});
exports.viewBanks = asyncHandler(async(req, res, next) => {
    const banks = await Bank.find().populate("userId").sort("-createdAt");
    if(banks){
        res.status(200).json(banks);
    }else{
        res.status(500);
        throw new Error("Banks Unavailable");
    }
})
exports.viewActiveBanks = asyncHandler(async(req, res, next) => {
    const banks = await Bank.find({status: "Active"});
    if(banks){
        res.status(200).json(banks);
    }else{
        res.status(500);
        throw new Error("Banks Unavailable")
    }
});

exports.updateBank = asyncHandler(async(req, res, next) => {
    const {name, code} = req.body;
    const {bankId} = req.params;
    if(!name){
        res.status(400);
        throw new Error("Bank Name is required");
    }
    if(!code){
        res.status(400);
        throw new Error("Bank Code is required");
    }
    if(!bankId){
        res.status(400);
        throw new Error("Bank Id is required");
    }
    //check if bankId is correct
    const bank = await Bank.findById({_id: bankId});
    if(!bank){
        res.status(400);
        throw new Error("Bank not found");
    }
    bank.name = name;
    bank.code = code;
    try {
        await bank.save();
        res.status(200).json({message: "Bank successfully modified"});
    } catch (error) {
        res.status(500);
        throw new Error("Sorry, an error occured, pls try again later");
    }
});

exports.updateBankStatus = asyncHandler(async(req, res, next) => {
    const {bankId} = req.params;
    const bank = await Bank.findById({_id: bankId});
    if(!bank){
        res.status(400);
        throw new Error("Bank not identified")
    }
    let status = bank.status;
    if(status === "Active"){
        bank.status = "Inactive";
    }else{
        bank.status = "Active";
    }
     const modifyBank = await bank.save();
    if(modifyBank){
        res.status(200).json({message: "Status Successfully modified"});
    }else{
        res.status(500);
        throw new Error("Sorry, an error occured, try again later");
    }
})


exports.getSignleBank = asyncHandler(async(req, res, next) => {
    const {bankId} = req.params;
    const bank = await Bank.findById({_id: bankId});
    if(bank){
        res.status(200).json(bank);
        
    }else{
        res.status(400);
        throw new Error("Bank not Found");
    }
    
        
})

