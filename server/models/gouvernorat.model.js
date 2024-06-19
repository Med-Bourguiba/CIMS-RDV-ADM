const mongoose = require("mongoose");

const gouvernoratSchema = new mongoose.Schema({
   
    COD_GOUV: String,
    LIB_GOUV: String
});

module.exports = mongoose.model("gouvernorats", gouvernoratSchema);
