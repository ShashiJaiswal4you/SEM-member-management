const { default: mongoose } = require("mongoose");

const workSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Not given"
    },
    phone: {
        type: Number,
        default: 1000000000
    },
    place: {
        type: String,
        default: "Not Given"
    },
    id: {
        type: String
    },
    date: {
        type: String,
        default: "Not Given"
    }
});

const Work = mongoose.model("Work", workSchema);

module.exports = Work;