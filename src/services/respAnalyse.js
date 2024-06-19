import axios from 'axios';

const ResponsableAnalyseService = {};

const BASE_URL = `http://localhost:5001/responsables`;

ResponsableAnalyseService.lister = function () {
  return axios.get(`${BASE_URL}/lister`);
};

ResponsableAnalyseService.ajouter = function (nouveauResponsable) {
  return axios.post(`${BASE_URL}/ajouter`, nouveauResponsable);
};

ResponsableAnalyseService.modifier = function (id, responsableModifie) {
  return axios.put(`${BASE_URL}/modifier/${id}`, responsableModifie);
};

ResponsableAnalyseService.supprimer = function (id) {
  return axios.delete(`${BASE_URL}/supprimer/${id}`);
};

ResponsableAnalyseService.listerSpecialite = function () {
  return axios.get(`${BASE_URL}/lister-spec`);
};
export default ResponsableAnalyseService;
