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
    password: String
});

const NewUser = mongoose.model("NewUser", regSchema);

module.exports = NewUser;