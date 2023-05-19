const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultySchema = new Schema({
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
    campus: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "campus"
    }
}, {timestamps: true});

module.exports = mongoose.model("Faculty", facultySchema);