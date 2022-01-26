import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://sigerh-api.devn.com.br',
});
