import axios from "axios";

const API = "/api/products";

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getProducts = ({ q = "", category = "", activeOnly = true } = {}) => {
  const params = {};

  if (q.trim()) {
    params.q = q.trim();
  }

  if (category.trim()) {
    params.category = category.trim();
  }

  params.activeOnly = activeOnly;

  return axios.get(API, {
    params,
    headers: authHeaders(),
  });
};

export const getProductById = (id) => {
  return axios.get(`${API}/${id}`, {
    headers: authHeaders(),
  });
};

export const addProduct = (data) => {
  return axios.post(API, data, {
    headers: authHeaders(),
  });
};

export const updateProduct = (id, data) => {
  return axios.put(`${API}/${id}`, data, {
    headers: authHeaders(),
  });
};
