import axios from 'axios';

const PaimentService = {};

const BASE_URL = `http://localhost:5001/paiments`

PaimentService.lister = function () {
  return axios.get(`${BASE_URL}/lister`);
};

PaimentService.getDernieresTransactions = function () {
  return axios.get(`${BASE_URL}/dernieres-transactions`);
};

export default PaimentService;
