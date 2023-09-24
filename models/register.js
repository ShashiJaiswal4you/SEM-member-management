const { default: mongoose } = require("mongoose");

const regSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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