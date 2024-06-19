const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.js");




router.get("/lister", patientController.lister);
router.post("/ajouter", patientController.ajouter);
router.put("/modifier/:id", patientController.modifier);
router.delete("/supprimer/:id", patientController.supprimer);
router.get("/lister-delegation", patientController.listerDelegation);
router.get("/lister-debiteur", patientController.listerDebiteur);



module.exports = router;

