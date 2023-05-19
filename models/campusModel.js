const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campusModel = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        required: true,
        default: "Active"
    }
}, 
{timestamps: true});

module.exports = mongoose.model("Campus", campusModel);