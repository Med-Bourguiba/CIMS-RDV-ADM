const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentification');

router.post('/login/admin', authController.loginAdmin);
router.post('/login/medecin', authController.loginMedecin);
router.post('/login/respAnalyse', authController.loginRespAnalyse); 

module.exports = router;
