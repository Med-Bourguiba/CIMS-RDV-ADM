import axios from 'axios';

const RdvService = {};

const BASE_URL = `http://localhost:5001/gestion_rdvs`

RdvService.lister = function () {
  return axios.get(`${BASE_URL}/lister`);
};

RdvService.ajouter = function (nouveauRdv) {
  return axios.post(`${BASE_URL}/ajouter`, nouveauRdv);
};

RdvService.modifier = function (id, rdvModifie) {
  return axios.put(`${BASE_URL}/modifier/${id}`, rdvModifie);
};

RdvService.supprimer = function (id, data) {
  return axios.post(`${BASE_URL}/supprimer/${id}`, data);
};

RdvService.getRDVannules = function() {
  return axios.get(`${BASE_URL}/annules`);
}



RdvService.getStatsByService = () => {
  return axios.get(`${BASE_URL}/get-stats-service`);
}

RdvService.getStatsByServiceAndMed = () => {
  return axios.get(`${BASE_URL}/get-stats-medecin`);
}

RdvService.getStatsByMntPaye = () => {
  return axios.get(`${BASE_URL}/get-stats-payment`);
}



RdvService.getAnalyses = function () {
  return axios.get(`${BASE_URL}/get-analyses`);
};

RdvService.modifierAnalyse = function (id, analyseModifie) {
  return axios.put(`${BASE_URL}/modifier-analyse/${id}`, analyseModifie);
};

RdvService.ajouterAnalyse = function (data) {
  return axios.post(`${BASE_URL}/ajouter-analyse`, data);
};

RdvService.editerAnalyse = function (id, data) {
  return axios.put(`${BASE_URL}/editer-analyse/${id}`, data);
};

RdvService.supprimerAnalyse = function (id, data) {
  return axios.post(`${BASE_URL}/supprimer-analyse/${id}`, { data });
};

RdvService.getAnalysesAnnulees = function() {
  return axios.get(`${BASE_URL}/analyses-annulees`);
}

export default RdvService;

