import axios from "axios";

const API = "/api/orders";

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const checkout = (items, checkoutDetails) => {
  return axios.post(
    `${API}/checkout`,
    {
      deliveryAddress: checkoutDetails.deliveryAddress,
      paymentMode: checkoutDetails.paymentMode,
      items: items.map((item) => ({
        productId: item.id,
        quantity: Number(item.quantity || 1),
      })),
    },
    {
      headers: authHeaders(),
    },
  );
};

export const getMyOrders = () => {
  return axios.get(`${API}/my`, {
    headers: authHeaders(),
  });
};

export const getMyOrder = (orderId) => {
  return axios.get(`${API}/my/${orderId}`, {
    headers: authHeaders(),
  });
};
