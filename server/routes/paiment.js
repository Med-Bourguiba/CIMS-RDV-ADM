const express = require("express");
const router = express.Router();
const paimentController = require("../controllers/paiment");

router.get("/lister", paimentController.lister);
router.get("/dernieres-transactions", paimentController.getDernieresTransactions);



module.exports = router;
