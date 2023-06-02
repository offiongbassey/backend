const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawalPinSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true
    }, 
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model("PinToken", withdrawalPinSchema);