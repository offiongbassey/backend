const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, "Please provide amount"]
    },
    currentBal: {
        type: Number
    },
    type: {
        type: String,
        default: ""
    },
    purpose: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    transactionCode: {
        type: String,
        default: ""
    }
}, {timestamps: true})


module.exports = mongoose.model("Withdraw", withdrawSchema);