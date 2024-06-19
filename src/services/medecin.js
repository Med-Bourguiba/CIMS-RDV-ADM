import axios from 'axios';

const MedecinService = {};

MedecinService.lister = function () {
  return axios.get('http://localhost:5001/gestion_medecins/lister');
};

MedecinService.ajouter = function (nouveauMedecin) {
  return axios.post('http://localhost:5001/gestion_medecins/ajouter', nouveauMedecin);
};

MedecinService.modifier = function (id, medecinModifie) {
  return axios.put(`http://localhost:5001/gestion_medecins/modifier/${id}`, medecinModifie);
};

MedecinService.supprimer = function (id) {
  return axios.delete(`http://localhost:5001/gestion_medecins/supprimer/${id}`);
};

MedecinService.listerGrade = function () {
  return axios.get('http://localhost:5001/gestion_medecins/lister-grade');
};


export default MedecinService;

