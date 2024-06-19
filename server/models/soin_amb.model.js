const mongoose = require("mongoose");

const soinAmbSchema = new mongoose.Schema({

        NUM_SOINS: String,
        COD_BENEF: {
            type: mongoose.Schema.Types.String,
            ref: 'beneficiaires' 
        },
        COD_SERV: {
            type: mongoose.Schema.Types.String,
            ref: 'services' 
        },
        COD_MED: {
            type: mongoose.Schema.Types.String,
            ref: 'medecins' 
        },
        DATE_SOINS: String,
        HEURE_SOINS: String,
        COD_DEBIT: {
            type: mongoose.Schema.Types.String,
            ref: 'debiteurs' 
        },
        NUM_CARNET: String,
        NUM_ASSURE: String,
        QUAL_ASSURE: String,
        NOM_PREN_AFF: String,
        MNT_PAYE: String,
        COD_GROUPE: {
            type: mongoose.Schema.Types.String,
            ref: 'groupe_soins' 
        },
        ETAT_SOINS: String,
        DOSS_MEDIC: String,
        MODE_SOINS: String,
        CAUSE_SOINS: String,
        OBSERV1: String,
        OBSERV2: String,
        OBSERV3: String,
        USER_ID: String,
        DATE_ENREG: String,
        SEANCE: String,
        RDV: String,
        USER_CREATION: String,
        DATE_CREATION: String,
        USER_MAJ: String,
        DATE_MAJ: String,
        USER_ANNULE: String,
        DATE_ANNULE: String,
        FILIERE: String,
        PLAFOND: String,
        COD_ETAB: String,
        NUM_ADM: String,
        MOTIF_ANNULE: String,
        MODE_SOINS_ACT: String,
        REF_CNAM: String,
        DROIT_CNAM: String,
        BEN_TYPE: String,
        BEN_RANG: String,
        IU_BNF: String,
        BEN_DATN: String,
        BEN_SEXE: String,
        CAISSE_CNAM: String
});

module.exports = mongoose.model("soins_ambs", soinAmbSchema);
