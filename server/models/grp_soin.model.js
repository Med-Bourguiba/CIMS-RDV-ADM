const mongoose = require("mongoose");

const groupeSoinSchema = new mongoose.Schema({
    COD_GROUPE: String,
    LIB_GROUPE: String,
    TARIF: String
});

module.exports = mongoose.model("groupe_soins", groupeSoinSchema);
