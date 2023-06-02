const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const {fileSizeFormatter} = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");

exports.createProduct = asyncHandler(async(req, res, next) => {
const {name, quantity, price, description, orderNote} = req.body;
if(!name || !quantity || !price || !description){
    res.status(400);
    throw new Error("Please fill in all fields");
}
let url = name.replace(/\s+/g, '').replace(/:/g, "-").replace("/", "-").toLowerCase();
//check if url exist.
const verifyUrl = await Product.findOne({url: url});
if(verifyUrl){
const digest = crypto.randomInt(0,198290);
url = url+digest;
}
const productCode = crypto.randomInt(0,1982902282829);

//image upload
let fileData = {};
if(req.file){
    //save image to cloudinary
    let uploadedFile;
    try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "schoolstore", resource_type: "image"})
    } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded")
    }
    fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
    }
}

const product = await Product.create({
    userId: req.user._id,
    name,
    quantity, 
    price,
    description,
    image: fileData,
    url,
    productCode,
    orderNote
});
res.status(201).json(product);

});

exports.getProducts = asyncHandler(async(req, res, next) => {
    const products = await Product.find({userId: req.user._id}).sort("-createdAt");
    if(products){
       res.status(200).json(products);
    }else{
        res.status(400);
        throw new Error("Product Not Found");
    }
});

exports.getProduct = asyncHandler(async(req, res, next) => {
    const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product){
        res.status(400);
        throw new Error("Product Not Found");
    }
    if(product.userId.toString() !== req.user._id.toString()){
        res.status(400);
        throw new Error("User not authorized");
    }
    res.status(200).json(product);
});

exports.deleteProduct = asyncHandler(async(req, res, next) => {
    const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product){
        res.status(400);
        throw new Error("Product not found");
    }
    if(product.userId.toString() !== req.user._id.toString()){
        res.status(400);
        throw new Error("User not authorized");
    }
    //check if product has been ordered before
    const verifyProductOrder = await Order.findOne({productId: productId});
    if(verifyProductOrder){
        res.status(400);
        throw new Error("This product has already been Ordered, you can disable it by updating it's Quantity to 0");
    }
    await product.deleteOne();
    res.status(200).json({message: "Product successfully deleted"});
});

exports.updateProduct = asyncHandler(async(req, res, next) => {
    const {productId} = req.params;
    const {name, quantity, price, description} = req.body;

    const product = await Product.findById({_id: productId});

    if(!name || !quantity || !price || !description){
    res.status(400);
    throw new Error("Please fill in all fields");
    }
    if(!product){
        res.status(400);
        throw new Error("Product not found");
    }
    if(product.userId.toString() !== req.user._id.toString()){
        res.status(400);
        throw new Error("User not authorized");
    }
//image upload
let fileData = {};
if(req.file){
    //save image to cloudinary
    let uploadedFile;
    try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "schoolstore", resource_type: "image"})
    } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded")
    }
    fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
    }
}
//update product
const savedProduct = await Product.findByIdAndUpdate(
    {_id: productId}, 
    {
        name,
        quantity, 
        price,
        description,
        image: Object.keys(fileData).length === 0 ? product.image : fileData
    }
);
if(savedProduct){
    res.status(201).json(savedProduct);
}else{
    res.status(400);
    throw new Error("An error occured, try again later");
}
});


exports.uploadProductSoftcopy = asyncHandler(async(req, res) => {
    const {productId} = req.params;
    const product = await Product.findById({_id: productId});
    if(!product){
        res.status(400);
        throw new Error("Product not found");
    }
    
//image upload
let fileData = {};
if(req.file){
    //save image to cloudinary
    // let uploadedFile;
    // try {
    //         uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "schoolstore", resource_type: "image"})
    // } catch (error) {
    //     res.status(500);
    //     throw new Error("Image could not be uploaded")
    // }
    fileData = {
        fileName: req.file.originalname,
        // filePath: uploadedFile.secure_url,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
    }
}
product.softCopy = fileData;
const updatedProduct = await product.save();
if(updatedProduct){
res.status(200).json(updatedProduct);
}else{
    res.status(500);
    throw new Error("An error occured, try again later");
}
});

exports.getAllProducts = asyncHandler(async(req, res, next) => {
    const products = await Product.find().populate("userId").sort("-createdAt");
    if(products){
       res.status(200).json(products);
    }else{
        res.status(400);
        throw new Error("Product Not Found");
    }
});

exports.getProductByUrl = asyncHandler(async(req, res, next) => {
    const {url} = req.params;
    const product = await Product.findOne({url: url}).populate("userId"); 
    if(product){
        res.status(200).json(product);
    }else{
        res.status(400);
        throw new Error("Product Not Found");
    }
});

exports.getProductByAuthor = asyncHandler(async(req, res, next) => {
    const {userId} = req.params;
    const product = await Product.find({userId: userId}).sort("-createdAt");
    if(product){
        res.status(200).json(product);
    }else{
        res.status(400);
        throw new Error("Product Not Found");
    }
});