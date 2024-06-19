const express = require("express");
const router = express.Router();
const rdvController = require("../controllers/rdv.js");



router.get("/lister", rdvController.lister);
router.post("/ajouter", rdvController.ajouter);
router.put("/modifier/:id", rdvController.modifier);
router.post("/supprimer/:id", rdvController.supprimer);
router.get("/annules", rdvController.listerAnnules);

router.get('/get-stats-service', rdvController.getStatsByCodService);
router.get('/get-stats-medecin', rdvController.getStatsByServiceAndMed);
router.get('/get-stats-payment', rdvController.getStatsByMntPaye);

router.get('/get-analyses', rdvController.getAnalyses);
router.put("/modifier-analyse/:id", rdvController.modifierAnalyse);
router.post('/ajouter-analyse', rdvController.ajouterAnalyse);
router.put('/editer-analyse/:id', rdvController.editerAnalyse);
router.post('/supprimer-analyse/:id', rdvController.supprimerAnalyse);
router.get("/analyses-annulees", rdvController.getAnalysesAnnulees);

module.exports = router;

