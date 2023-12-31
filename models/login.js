const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Not given"
    },
    email: {
        type: String,
        default: "default@gmail.com"
    },
    phone: {
        type: Number,
        default: 6203932587
    },
    address: {
        type: String,
        default: "Katihar - sharifganj"
    },
    salary: {
        type: Number,
        default: 10000
    },
    password: String,
    aadhar_card: {
        type: String,
    },
    pan_card: {
        type: String,
    },
    profile_pic: {
        type: String
    },
    id: {
        type: String
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;