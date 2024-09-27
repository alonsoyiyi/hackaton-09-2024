const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    fullname: { type: String, required: true, unique: true },
    skills: { type: [skillSchema], default: [] },
},{
    collection: "user_skills" 
});


const User = mongoose.model("User", UserSchema);

module.exports = User;