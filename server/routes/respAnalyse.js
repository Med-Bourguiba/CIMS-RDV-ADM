const express = require("express");
const router = express.Router();
const responsableAnalyseController = require("../controllers/respAnalyse");

router.get("/lister", responsableAnalyseController.lister);
router.post("/ajouter", responsableAnalyseController.ajouter);
router.put("/modifier/:id", responsableAnalyseController.modifier);
router.delete("/supprimer/:id", responsableAnalyseController.supprimer);
router.get("/lister-spec", responsableAnalyseController.listerSpecialite);


module.exports = router;
