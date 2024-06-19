const Service = require('../models/service.model');
const ServiceAnalyse = require('../models/seviceAnalyse');

exports.lister = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des services" });
  }
};

exports.listerAnalyse = async (req, res) => {
  try {
    const services = await ServiceAnalyse.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des services" });
  }
};

