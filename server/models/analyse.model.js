const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyseSchema = new Schema({
  NUM_ANALYSE: {
    type: String,
    required: true
  },
  NUM_RDV: {
    type: String,
    required: true
  },
  TYPE_ANALYSE: {
    type: String,
    required: true
  },
  DESCRIPTION: {
    type: String,
    required: true
  },
  DATE_ANALYSE: {
    type: Date,
    required: true
  },
  HEURE: {
    type: String,
    required: true
  },
  PRIX: {
    type: Number,
    required: true
  },
  RESULTATS: {
    type: String,
    required: false,
    default: ""
  },
  MEDECIN_RESPONSABLE: {
    type: String,
    required: true
  },
  VALIDEE: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('analyses', analyseSchema);
