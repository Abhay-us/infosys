const ADDRESS_KEY = "checkoutAddress";

export const getCheckoutAddress = () => {
  try {
    const savedAddress = localStorage.getItem(ADDRESS_KEY);
    return savedAddress ? JSON.parse(savedAddress) : null;
  } catch {
    return null;
  }
};

export const saveCheckoutAddress = (address) => {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  window.dispatchEvent(new Event("address-updated"));
  return address;
};

export const formatCheckoutAddress = (address) => {
  if (!address) {
    return "";
  }

  return [
    address.fullName,
    address.phone ? `Phone: ${address.phone}` : "",
    address.house,
    address.street,
    address.landmark ? `Landmark: ${address.landmark}` : "",
    [address.city, address.state, address.pincode].filter(Boolean).join(" - "),
    address.country,
    address.addressType ? `Type: ${address.addressType}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};
