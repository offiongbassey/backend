const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
       type: String,
       required: [true, "Please add a name"],
        trime: true
    },
    productCode: {
        type: String,
        default: "p1"
    },
    url: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: [true, "Please add Quantity"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please add a Price"]
    },
    description: {
        type: String,
        required: [true, "Please add a Description"],
        trim: true
    },
    image: {
        type: Object,
        default: {}
    }, 
    orderNote: {
        type: String,
        default: ""

    },
    status: {
        type: String,
        default: "Active"
    },
    serviceCharge: {
        type: Number,
        default: ""
    },
    grandTotal: {
        type: Number,
        default: ""
    },
    softCopy: {
        type: Object,
        default: {}
    }

    

}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);