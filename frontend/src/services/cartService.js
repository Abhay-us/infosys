const CART_KEY = "cartItems";

export const getCartItems = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    return Array.isArray(storedItems) ? storedItems : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
};

export const getCartCount = () => {
  return getCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0);
};

export const addToCart = (product) => {
  const items = getCartItems();
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      price: Number(product.price || 0),
      stockQuantity: product.stockQuantity,
      quantity: 1,
    });
  }

  saveCartItems(items);

  return items;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const nextQuantity = Math.max(1, Number(quantity || 1));
  const items = getCartItems().map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item));

  saveCartItems(items);

  return items;
};

export const removeCartItem = (productId) => {
  const items = getCartItems().filter((item) => item.id !== productId);

  saveCartItems(items);

  return items;
};

export const clearCart = () => {
  saveCartItems([]);
};
