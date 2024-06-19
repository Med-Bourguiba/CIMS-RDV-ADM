const mongoose = require("mongoose");

const responsableAnalyseSchema = new mongoose.Schema({
    COD_RESP: {
        type: String,
        required: true,
        unique: true
    },
    NOM_PRENOM: {
        type: String,
        required: true
    },
    DATE_NAISS: {
        type: Date,
        required: true
    },
    SEXE: {
        type: String,
        required: true
    },
    TELEPHONE: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{8}/.test(v);
            },
            message: props => `${props.value} n'est pas un numéro de téléphone valide!`
        }
    },
    ADRESSE: {
        type: String,
        required: true
    },
    COD_SERV: {
        type: String,
        ref: 'service_analyses',
        required: true
    },
    SPECIALITE: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("respanalyses", responsableAnalyseSchema);
