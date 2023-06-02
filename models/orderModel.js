const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productCode: {
        type: String,
        default: ""
    },
    orderCode: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
    },
    serviceCharge: {
        type: Number,
    },
    grandTotal: {
        type: Number,
    }, 
    status: {
        type: String,
        default: "Pending"
    },
    transactionCode: {
        type: String,
        default: ""
    }
    
}, {timestamps: true});


module.exports = mongoose.model("Order", orderSchema);