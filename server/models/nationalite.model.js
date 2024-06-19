const mongoose = require("mongoose");

const nationaliteSchema = new mongoose.Schema({
    COD_NAT: String,
    LIB_NAT: String
});

module.exports = mongoose.model("nationalites", nationaliteSchema);
