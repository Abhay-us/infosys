import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { clearCart, getCartItems, removeCartItem, updateCartItemQuantity } from "../services/cartService";
import "../styles/dashboard.css";

function CartPage() {
  const [items, setItems] = useState(() => getCartItems());

  useEffect(() => {
    const syncCartItems = () => setItems(getCartItems());

    window.addEventListener("cart-updated", syncCartItems);

    return () => window.removeEventListener("cart-updated", syncCartItems);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [items]);

  const handleQuantityChange = (productId, quantity) => {
    setItems(updateCartItemQuantity(productId, quantity));
  };

  const handleRemove = (productId) => {
    setItems(removeCartItem(productId));
  };

  const handleClearCart = () => {
    clearCart();
    setItems([]);
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Cart</h1>
          <p className="dashboard-copy">Review products added from the catalog.</p>
        </div>

        <Link className="logout-button" to="/products">
          Back to products
        </Link>
      </section>

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add products from the product list and they will appear here.</p>
          <Link className="primary-button cart-empty-action" to="/products">
            Browse products
          </Link>
        </section>
      ) : (
        <section className="cart-layout" aria-label="Cart items">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  {item.imageUrl ? <img alt={item.name} src={item.imageUrl} /> : <span>{getInitials(item.name)}</span>}
                </div>

                <div className="cart-item-details">
                  <span className="product-id">#{item.id}</span>
                  <h2>{item.name}</h2>
                  <p>{item.category || "Uncategorized"}</p>
                  <strong>{formatPrice(item.price)}</strong>
                </div>

                <div className="cart-item-actions">
                  <label className="field cart-quantity">
                    <span>Qty</span>
                    <input
                      min="1"
                      max={item.stockQuantity || undefined}
                      type="number"
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                    />
                  </label>
                  <button className="secondary-button" type="button" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary" aria-label="Cart summary">
            <h2>Order summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="summary-row summary-total">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button className="primary-button" type="button">
              Checkout
            </button>
            <button className="secondary-button" type="button" onClick={handleClearCart}>
              Clear cart
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}

function formatPrice(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default CartPage;
