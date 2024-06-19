const RDV = require("../models/rdv.model");
const SoinAmb = require('../models/soin_amb.model')
const Analyse = require('../models/analyse.model');
const RdvAnnule = require("../models/rdv_annulées");
const AnalyseAnnulee = require("../models/analyse_annulées");
const { format } = require('date-fns');

exports.lister = async (req, res) => {
  try {
    const rdvs = await RDV.find();
    res.status(200).json(rdvs);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
  }
};

exports.ajouter = async (req, res) => {
  try {
    const nouveauRdv = new RDV(req.body);
    const rdvAjoute = await nouveauRdv.save();
    res.status(201).json(rdvAjoute);
  } catch (error) {
    console.error("Erreur lors de l'ajout du rendez-vous :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du rendez-vous" });
  }
};

exports.modifier = async (req, res) => {
  try {
    const { id } = req.params;
    const rdvModifie = await RDV.findByIdAndUpdate(id, req.body, { new: true });
    if (!rdvModifie) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.status(200).json(rdvModifie);
  } catch (error) {
    console.error("Erreur lors de la modification du rendez-vous :", error);
    res.status(500).json({ error: "Erreur lors de la modification du rendez-vous" });
  }
};



exports.supprimer = async (req, res) => {
  const { id } = req.params;
  let { user_annulation } = req.body;
  const date_annulation = new Date();

  console.log("Received request to delete RDV with ID:", id);
  console.log("User Annulation:", user_annulation);

  try {
    const rdvSupprime = await RDV.findById(id); // Using findById instead of findOne
    if (!rdvSupprime) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    const raison = " ";
    let numRdvAnnule = rdvSupprime.NUM_RDV;
    let rdvAnnuleExists = await RdvAnnule.findOne({ NUM_RDV: numRdvAnnule });

    // S'assurer de l'unicité de NUM_RDV
    while (rdvAnnuleExists) {
      numRdvAnnule += '_A';
      rdvAnnuleExists = await RdvAnnule.findOne({ NUM_RDV: numRdvAnnule });
    }

    const nouveauRdvAnnule = new RdvAnnule({
      COD_MED: rdvSupprime.COD_MED,
      COD_BENEF: rdvSupprime.COD_BENEF,
      DATE_RDV: rdvSupprime.DATE_RDV,
      HEURE_RDV: rdvSupprime.HEURE_RDV,
      COD_SERV: rdvSupprime.COD_SERV,
      NUM_RDV: numRdvAnnule,
      NUM_DOSSIER: rdvSupprime.NUM_DOSSIER,
      GSM: rdvSupprime.GSM,
      DATE_ANNULATION: date_annulation,
      USER_ANNULATION: user_annulation,
      RAISON_ANNULATION: raison
    });

    await nouveauRdvAnnule.save();
    await RDV.findByIdAndDelete(id); // Using findByIdAndDelete

    res.status(200).json({ message: "Rendez-vous annulé et supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du rendez-vous :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du rendez-vous" });
  }
};



exports.listerAnnules = async (req, res) => {
  try {
    const rdvsAnnules = await RdvAnnule.find();
    res.status(200).json(rdvsAnnules);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous annulés :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous annulés" });
  }
};






// Statistique 

exports.getStatsByCodService = async (req, res) => {
  try {
      const stats = await RDV.aggregate([
          {
              $lookup: {
                  from: "services", // the collection to join
                  localField: "COD_SERV", // field from the input documents
                  foreignField: "COD_SERV", // field from the documents of the "from" collection
                  as: "serviceDetails" // array field added to input documents
              }
          },
          {
              $unwind: "$serviceDetails" // Optional: flatten the serviceDetails if you expect one match per rdv
          },
          {
              $group: {
                  _id: "$serviceDetails.COD_SERV", // Now grouping by the service name or any other field you are interested in
                  count: { $sum: 1 },
                  rdvs: { $push: "$$ROOT" }
              }
          }
      ]);

      console.log(stats);
      res.status(200).json({
          message: "Statistics Fetched Successfully!",
          data: stats
      });
  } catch (error) {
      console.error("Error lors de la fetch de statistique :", error);
      res.status(500).json({ error: "Erreur lors de la fetch de statistique" });
  }
};


exports.getStatsByServiceAndMed = async (req, res) => {
  try {
      const stats = await RDV.aggregate([
          {
              $lookup: {
                  from: "medecins",
                  localField: "COD_MED",
                  foreignField: "COD_MED",
                  as: "medDetails"
              }
          },
          {
              $unwind: "$medDetails"
          },
          {
              $lookup: {
                  from: "services",
                  localField: "COD_SERV",
                  foreignField: "COD_SERV",
                  as: "serviceDetails"
              }
          },
          {
              $unwind: "$serviceDetails"
          },
          {
              $group: {
                  _id: {
                      service: "$serviceDetails.DES_SERV",
                      medecin: "$medDetails.NOM_PREN_MED"
                  },
                  count: { $sum: 1 }
              }
          },
          {
              $group: {
                  _id: "$_id.service",
                  medecins: {
                      $push: {
                          medecin: "$_id.medecin",
                          count: "$count"
                      }
                  }
              }
          },
          {
              $project: {
                  _id: 0,
                  service: "$_id",
                  medecins: "$medecins"
              }
          }
      ]);

      res.status(200).json({
          message: "Statistics Fetched Successfully!",
          data: stats
      });
  } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Error fetching statistics" });
  }
};


exports.getStatsByMntPaye = async (req, res) => {
  try {
    const stats = await SoinAmb.aggregate([
      {
        $addFields: {
          normalizedDate: {
            $concat: [
              { $substr: [{ $arrayElemAt: [{ $split: ["$DATE_SOINS", "/"] }, 1] }, 0, 2] },
              "/",
              { $substr: [{ $arrayElemAt: [{ $split: ["$DATE_SOINS", "/"] }, 0] }, 0, 2] },
              "/",
              "20",  // assuming all dates are in the 2000s
              { $substr: [{ $arrayElemAt: [{ $split: ["$DATE_SOINS", "/"] }, 2] }, 0, 2] }
            ]
          },
          convertedMNT_PAYE: {
            $cond: {
              if: { $eq: ["$MNT_PAYE", ""] }, // Check if MNT_PAYE is an empty string
              then: 0, // Treat empty string as 0
              else: { $convert: { input: "$MNT_PAYE", to: "decimal", onError: 0, onNull: 0 } }
            }
          }
        }
      },
      {
        $addFields: {
          dateSoinsDate: { $dateFromString: { dateString: "$normalizedDate", format: "%m/%d/%Y" } } // Now using normalizedDate
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$dateSoinsDate" },  // Group by month extracted from the date
            year: { $year: "$dateSoinsDate" }  // Including year to avoid mixing data from different years
          },
          totalAmount: { $sum: "$convertedMNT_PAYE" } // Sum up MNT_PAYE for each group
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and then month
      }
    ]);

    const totalAmount = stats.reduce((sum, stat) => sum + parseFloat(stat.totalAmount), 0); // Ensure totalAmount is parsed as float

    console.log("STATS", stats);
    return res.status(200).json({
      message: "Status Fetched",
      data: stats,
      total: totalAmount // Return the total amount
    });

  } catch (error) {
    console.error("Error lors de la fetch de statistique :", error);
    res.status(500).json({ error: "Erreur lors de la fetch de statistique" });
  }
}







/** CRUD   :   Analyses **/


exports.getAnalyses = async (req, res) => {
  try {
    const analyses = await Analyse.find();
    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//validation du medecin
exports.modifierAnalyse = async (req, res) => {
  try {
    const { id } = req.params;
    const analyseModifie = req.body;
    const updatedAnalyse = await Analyse.findByIdAndUpdate(id, analyseModifie, { new: true });
    res.status(200).json(updatedAnalyse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.ajouterAnalyse = async (req, res) => {
  const { NUM_RDV, TYPE_ANALYSE, DESCRIPTION, DATE_ANALYSE, HEURE, PRIX, RESULTATS, MEDECIN_RESPONSABLE } = req.body;

  try {
    if (!NUM_RDV || !TYPE_ANALYSE || !DESCRIPTION || !DATE_ANALYSE || !HEURE || !PRIX || !MEDECIN_RESPONSABLE) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const lastAnalyse = await Analyse.findOne().sort({ NUM_ANALYSE: -1 }).exec();
    let newNumAnalyse = 1;
    if (lastAnalyse) {
      const lastNum = parseInt(lastAnalyse.NUM_ANALYSE.replace('A', ''), 10);
      newNumAnalyse = lastNum + 1;
    }

    const nouvelleAnalyse = new Analyse({
      NUM_ANALYSE: `A${newNumAnalyse.toString().padStart(4, '0')}`, 
      NUM_RDV,
      TYPE_ANALYSE,
      DESCRIPTION,
      DATE_ANALYSE: format(new Date(DATE_ANALYSE), 'yyyy-MM-dd'),
      HEURE,
      PRIX,
      RESULTATS: RESULTATS || "", 
      MEDECIN_RESPONSABLE,
      VALIDEE: false
    });

    const analyseSauvegardee = await nouvelleAnalyse.save();
    res.status(201).json(analyseSauvegardee);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'analyse :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'analyse", error: error.message });
  }
};





exports.editerAnalyse = async (req, res) => {
  const { id } = req.params;
  const { NUM_ANALYSE, NUM_RDV, TYPE_ANALYSE, DESCRIPTION, DATE_ANALYSE, HEURE, PRIX, RESULTATS, MEDECIN_RESPONSABLE } = req.body;
  try {
    const analyseMiseAJour = await Analyse.findByIdAndUpdate(id, {
      NUM_ANALYSE,
      NUM_RDV,
      TYPE_ANALYSE,
      DESCRIPTION,
      DATE_ANALYSE: format(new Date(DATE_ANALYSE), 'yyyy-MM-dd'),
      HEURE,
      PRIX,
      RESULTATS,
      MEDECIN_RESPONSABLE
    }, { new: true });
    if (!analyseMiseAJour) {
      return res.status(404).json({ message: "Analyse non trouvée" });
    }
    res.status(200).json(analyseMiseAJour);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'analyse :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'analyse" });
  }
};




exports.supprimerAnalyse = async (req, res) => {
  const { id } = req.params;
  const { user_annulation } = req.body.data;
  const date_annulation = new Date();

  try {
    console.log(user_annulation)
    const analyseSupprimee = await Analyse.findById(id);
    if (!analyseSupprimee) {
      return res.status(404).json({ message: "Analyse non trouvée" });
    }
    const raison = "  ";
    let numAnalyseAnnule = analyseSupprimee.NUM_ANALYSE;
    let analyseAnnuleeExists = await AnalyseAnnulee.findOne({ NUM_ANALYSE: numAnalyseAnnule });

    // Ensure uniqueness of NUM_ANALYSE
    while (analyseAnnuleeExists) {
      numAnalyseAnnule += '_A';
      analyseAnnuleeExists = await AnalyseAnnulee.findOne({ NUM_ANALYSE: numAnalyseAnnule });
    }

    const nouvelleAnalyseAnnulee = new AnalyseAnnulee({
      NUM_ANALYSE: numAnalyseAnnule,
      NUM_RDV: analyseSupprimee.NUM_RDV,
      HEURE: analyseSupprimee.HEURE,
      TYPE_ANALYSE: analyseSupprimee.TYPE_ANALYSE,
      DESCRIPTION: analyseSupprimee.DESCRIPTION,
      PRIX: analyseSupprimee.PRIX,
      DATE_ANALYSE: analyseSupprimee.DATE_ANALYSE,
      MEDECIN_RESPONSABLE: analyseSupprimee.MEDECIN_RESPONSABLE,
      DATE_ANNULATION: date_annulation,
      USER_ANNULATION: user_annulation,
      RAISON_ANNULATION: raison
    });

    await nouvelleAnalyseAnnulee.save();
    await Analyse.findByIdAndDelete(id);

    res.status(200).json({ message: "Analyse annulée et supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'analyse :", error);
    res.status(500).json({ error: "Erreur lors de l'annulation de l'analyse" });
  }
};



exports.getAnalysesAnnulees = async (req, res) => {
  try {
    const analyses = await AnalyseAnnulee.find();
    res.status(200).json(analyses);
  } catch (error) {
    console.error("Erreur lors de la récupération des analyses annulées :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des analyses annulées" });
  }
};