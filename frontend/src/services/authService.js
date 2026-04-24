import axios from "axios";

const API = "/api/users";

export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

export const validateToken = (token) => {
  return axios.get(`${API}/validate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
