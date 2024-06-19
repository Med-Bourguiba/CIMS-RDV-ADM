const ResponsableAnalyse = require("../models/respAnalyse");
const Specialite = require("../models/specialite.model");

const bcrypt = require("bcrypt");

exports.lister = async (req, res) => {
  try {
    const responsables = await ResponsableAnalyse.find();
    res.status(200).json(responsables);
  } catch (error) {
    console.error("Erreur lors de la récupération des responsables :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des responsables" });
  }
};

exports.ajouter = async (req, res) => {
  try {
    const lastResponsable = await ResponsableAnalyse.findOne().sort({ COD_RESP: -1 }).exec();
    let newCodResp;
    if (lastResponsable) {
      const lastCodNumber = parseInt(lastResponsable.COD_RESP.substring(1));
      newCodResp = `R${(lastCodNumber + 1).toString().padStart(3, '0')}`;
    } else {
      newCodResp = 'R001';
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const nouveauResponsable = new ResponsableAnalyse({
      ...req.body,
      COD_RESP: newCodResp,
      password: hash
    });

    const responsableAjoute = await nouveauResponsable.save();
    res.status(201).json(responsableAjoute);
  } catch (error) {
    console.error("Erreur lors de l'ajout du responsable :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du responsable" });
  }
};

exports.modifier = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    const responsableModifie = await ResponsableAnalyse.findByIdAndUpdate(id, rest, { new: true });
    if (!responsableModifie) {
      return res.status(404).json({ message: "Responsable non trouvé" });
    }
    res.status(200).json(responsableModifie);
  } catch (error) {
    console.error("Erreur lors de la modification du responsable :", error);
    res.status(500).json({ error: "Erreur lors de la modification du responsable" });
  }
};

exports.supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    const responsableSupprime = await ResponsableAnalyse.findByIdAndDelete(id);
    if (!responsableSupprime) {
      return res.status(404).json({ message: "Responsable non trouvé" });
    }
    res.status(200).json({ message: "Responsable supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du responsable :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du responsable" });
  }
};



exports.listerSpecialite = async (req, res) => {
  try {
    const specialites = await Specialite.find();
    res.status(200).json(specialites);
  } catch (error) {
    console.error("Erreur lors de la récupération des spécialités :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des spécialités" });
  }
};