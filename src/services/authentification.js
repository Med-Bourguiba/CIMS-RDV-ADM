import axios from 'axios';

const authService = {};

authService.loginAdmin = function (data) {
  return axios.post('http://localhost:5001/auth/login/admin', data);
};

authService.loginMedecin = function (data) {
  return axios.post('http://localhost:5001/auth/login/medecin', data);
};

authService.loginRespAnalyse = function (data) {
  return axios.post('http://localhost:5001/auth/login/respAnalyse', data);
};


export default authService;
