const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "faculty"
    }
}, {timestamps: true});

module.exports = mongoose.model("Department", departmentSchema);