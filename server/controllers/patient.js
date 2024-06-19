const PATIENT = require("../models/benef.model");
const DELEG = require("../models/delegation.model");
const DEBIT = require("../models/debiteur.model");


exports.lister = async (req, res) => {
  try {
    const patients = await PATIENT.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur lors de la récupération des patients :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des patients" });
  }
};

exports.ajouter = async (req, res) => {
  try {
    const nouveauPatient = new PATIENT(req.body);
    const patientAjoute = await nouveauPatient.save();
    res.status(201).json(patientAjoute);
  } catch (error) {
    console.error("Erreur lors de l'ajout du patient :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du patient" });
  }
};

exports.modifier = async (req, res) => {
  try {
    const { id } = req.params;
    const patientModifie = await PATIENT.findByIdAndUpdate(id, req.body, { new: true });
    if (!patientModifie) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }
    res.status(200).json(patientModifie);
  } catch (error) {
    console.error("Erreur lors de la modification du patient :", error);
    res.status(500).json({ error: "Erreur lors de la modification du patient" });
  }
};

exports.supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    const patientSupprime = await PATIENT.findByIdAndDelete(id);
    if (!patientSupprime) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }
    res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du patient :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du patient" });
  }
};


exports.listerDelegation = async (req, res) => {
  try {
    const delegations = await DELEG.find();
    res.status(200).json(delegations);
  } catch (error) {
    console.error("Erreur lors de la récupération des delegations :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des delegations" });
  }
};


exports.listerDebiteur = async (req, res) => {
  try {
    const debiteurs = await DEBIT.find();
    res.status(200).json(debiteurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des debiteurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des debiteurs" });
  }
};