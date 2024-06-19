const Paiment = require("../models/paiment");

exports.lister = async (req, res) => {
  try {
    const paiements = await Paiment.find();
    res.status(200).json(paiements);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des paiements" });
  }
};

exports.getDernieresTransactions = async (req, res) => {
  try {
    const paiements = await Paiment.find().sort({ DATE_PAIEMENT: -1 }).limit(8);
    res.status(200).json(paiements);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières transactions :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des dernières transactions" });
  }
};