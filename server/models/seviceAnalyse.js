const mongoose = require("mongoose");

const serviceAnalyseSchema = new mongoose.Schema({
    COD_SERV: {
        type: String,
        required: true,
        unique: true
    },
    DES_SERV: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("service_analyses", serviceAnalyseSchema);
