const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your First Name."]
    },
    lastName: {
            type: String,
            required: [true, "Please provide your Last Name"]
    },
    otherName: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please add an Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid Email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a Password"],
        minLength: [6, "Password must be up to 6 characters"]
     },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone: {
        type: String,
        default: "+234"
    },
    bio: {
        type: String,
        maxLength: [1000, "Bio must not be more than 1000 characters"],
        default: ''
    },
    updateStatus: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: "Pending",
    }, 
    role: {
        type: String,
        default: "Student",
    },
    address: {
        type: String,
        default: ""
    },
    regNumber: {
        type: String,
        default: ""
    },
    campus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campus",
        default: null
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        default: null
    }, 
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },
    unit: {
        type: String,
        default: ""
    },
    walletPin: {
        type: String,
        default: ""
    },
    accountNumber: {
        type: Number,
        default: ""
    },
    accountName: {
        type: String,
        default: ""
    },
    bank: {
        type: String,
        default: ""
    },
    balance: {
        type: Number,
        default: 0
    },
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
        default: null
    },
    bankStatus: {
        type: String,
        default: "Inactive"
    },
    bankVerificationId: {
        type: Number,
        default: ""
    },
    bankRecipientCode: {
        type: String,
        default: ""
    },
    bankCode: {
        type: String,
        default: 0
    }



}, {
    timestamps: true});

    userSchema.pre("save", async function(next) {
        if(!this.isModified("password")){
            return next();
        }
        //password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    });

    module.exports = mongoose.model('User', userSchema);