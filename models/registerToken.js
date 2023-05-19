const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("RegisterToken", registerTokenSchema);