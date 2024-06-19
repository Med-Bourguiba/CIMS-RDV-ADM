const Medecin = require("../models/medecin.model");
const Grades = require("../models/grade.model");
const bcrypt = require('bcrypt');

exports.lister = async (req, res) => {
  try {
    const medecins = await Medecin.find();
    res.status(200).json(medecins);
  } catch (error) {
    console.error("Erreur lors de la récupération des médecins :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des médecins" });
  }
};


exports.ajouter = async (req, res) => {
  try {
    const { username, password, ...rest } = req.body;
    
    const medecinExiste = await Medecin.findOne({ username });
    if (medecinExiste) {
      return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const nouveauMedecin = new Medecin({ username, password: hash, ...rest });
    const medecinAjoute = await nouveauMedecin.save();
    res.status(201).json(medecinAjoute);
  } catch (error) {
    console.error("Erreur lors de l'ajout du médecin :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du médecin" });
  }
};



exports.modifier = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    const medecinModifie = await Medecin.findByIdAndUpdate(id, rest, { new: true });
    if (!medecinModifie) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    res.status(200).json(medecinModifie);
  } catch (error) {
    console.error("Erreur lors de la modification du médecin :", error);
    res.status(500).json({ error: "Erreur lors de la modification du médecin" });
  }
};



exports.supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    const medecinSupprime = await Medecin.findByIdAndDelete(id);
    if (!medecinSupprime) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    res.status(200).json({ message: "Médecin supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du médecin :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du médecin" });
  }
};


exports.listerGrade = async (req, res) => {
  try {
    const grades = await Grades.find();
    res.status(200).json(grades);
  } catch (error) {
    console.error("Erreur lors de la récupération des grades :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des grades" });
  }
};