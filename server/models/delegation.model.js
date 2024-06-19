const mongoose = require("mongoose");

const delegationSchema = new mongoose.Schema({
    
    COD_DELEG: String,
    LIB_DELEG: String,
    COD_GOUV: {
        type: mongoose.Schema.Types.String,
        ref: 'gouvernorats' 
    }
});

module.exports = mongoose.model("delegations", delegationSchema);
