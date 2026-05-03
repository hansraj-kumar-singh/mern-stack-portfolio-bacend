import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
    },
    aboutMe: {
        type: String,
        required: [true, "about me is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    portfolioUrl: {
        type: String,
        
    },
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    linkedinURL: String, 
    resetPasswordToken: String,
    resetPasswordExpire: Date, 
});


//FOR HASHING PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// FOR HASHING THE PASSWORD AND COMPARING THE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATE JSON WEB TOKEN
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export const User = mongoose.model("User", userSchema);