const express = require("express");
const router = express.Router();
const medecinController = require("../controllers/medecin.js");




router.get("/lister", medecinController.lister);
router.post("/ajouter", medecinController.ajouter);
router.put("/modifier/:id", medecinController.modifier);
router.delete("/supprimer/:id", medecinController.supprimer);
router.get("/lister-grade", medecinController.listerGrade);



module.exports = router;

