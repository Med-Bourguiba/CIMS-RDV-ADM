const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.js");



router.get("/lister", serviceController.lister);
router.get("/lister-analyse", serviceController.listerAnalyse);


module.exports = router;