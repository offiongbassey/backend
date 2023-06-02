const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    amount: {
        type: Number
    },
    serviceCharge: {
        type: Number
    },
    grandTotal: {
        type: Number
    },
    type: {
        type: String,
    },
    purpose: {
        type: String
    },
    status: {
        type: String
    },
    transactionCode: {
        type: String
    }
}, 
{timestamps: true});

module.exports = mongoose.model("Transaction", transactionSchema);