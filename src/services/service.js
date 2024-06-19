import axios from 'axios';

const ServiceService = {};

const BASE_URL = `http://localhost:5001/services`

ServiceService.lister = function () {
  return axios.get(`${BASE_URL}/lister`);
};

ServiceService.listerAnalyse = function () {
  return axios.get(`${BASE_URL}/lister-analyse`);
};


export default ServiceService;
