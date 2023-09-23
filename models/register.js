const { default: mongoose } = require("mongoose");

const regSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Not given"
    },
    email: {
        type: String,
        default: "default@gmail.com"
    },
    password: {
        type: String,
        default: "password"
    },
    date: {
        type: Date,
    },
    aadhar_card: {
        type: Buffer
    },
    pan_card: {
        type: String
    },
    profile_pic: {
        type: String
    }
});

const NewUser = mongoose.model("NewUser", regSchema);

module.exports = NewUser;