import axios from 'axios';

const PatientService = {};

PatientService.lister = function () {
  return axios.get('http://localhost:5001/gestion_patients/lister');
};

PatientService.ajouter = function (nouveauPatient) {
  return axios.post('http://localhost:5001/gestion_patients/ajouter', nouveauPatient);
};

PatientService.modifier = function (id, patientModifie) {
  return axios.put(`http://localhost:5001/gestion_patients/modifier/${id}`, patientModifie);
};

PatientService.supprimer = function (id) {
  return axios.delete(`http://localhost:5001/gestion_patients/supprimer/${id}`);
};

PatientService.listerDelegation = function () {
  return axios.get('http://localhost:5001/gestion_patients/lister-delegation');
};

PatientService.listerDebiteur = function () {
  return axios.get('http://localhost:5001/gestion_patients/lister-debiteur');
};

export default PatientService;

