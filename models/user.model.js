const mongoose = require('mongoose');
const {customAlphabet } = require('nanoid');
const Mycustomnanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => Mycustomnanoid(),    
},  first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
    },
    {
        timestamps: true,
        _id: false,
    
    });

    // Create a pre save hook
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;