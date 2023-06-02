const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankModel = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    }
}, {timestamps: true});

module.exports = mongoose.model("Bank", bankModel);