import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { clearCart, getCartItems } from "../services/cartService";
import { checkout } from "../services/orderService";
import "../styles/dashboard.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCartItems());
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH_ON_DELIVERY");
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const syncCartItems = () => setItems(getCartItems());

    window.addEventListener("cart-updated", syncCartItems);

    return () => window.removeEventListener("cart-updated", syncCartItems);
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [items]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setMessage("Delivery address is required.");
      return;
    }

    setStatus("placing");
    setMessage("");

    try {
      const response = await checkout(items, {
        deliveryAddress: deliveryAddress.trim(),
        paymentMode,
      });
      clearCart();
      navigate(`/orders/${response.data.id}`, {
        replace: true,
        state: {
          order: response.data,
          successMessage: "Order placed successfully.",
        },
      });
    } catch (error) {
      setStatus("ready");
      setMessage(error.response?.data?.message || error.response?.data?.error || "Unable to place order.");
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Place order</h1>
          <p className="dashboard-copy">Confirm the products and total before placing your order.</p>
        </div>

        <div className="header-actions">
          <Link className="secondary-button" to="/myorders">
            My orders
          </Link>
          <Link className="logout-button" to="/cart">
            Back to cart
          </Link>
        </div>
      </section>

      {message && <p className="status-message">{message}</p>}

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>No items to checkout</h2>
          <p>Add products to cart before placing an order.</p>
          <Link className="primary-button cart-empty-action" to="/products">
            Browse products
          </Link>
        </section>
      ) : (
        <section className="cart-layout" aria-label="Checkout details">
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

                <div className="order-line-total">
                  <span>Qty {item.quantity}</span>
                  <strong>{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary" aria-label="Order total">
            <h2>Order total</h2>
            <label className="field">
              Delivery address
              <textarea
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="House number, street, city, state, pincode"
                rows="4"
                required
              />
            </label>
            <label className="field">
              Payment mode
              <select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)} required>
                <option value="CASH_ON_DELIVERY">Cash on delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Credit / debit card</option>
                <option value="NET_BANKING">Net banking</option>
              </select>
            </label>
            <div className="summary-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="summary-row summary-total">
              <span>Total price</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="primary-button" type="button" disabled={status === "placing"} onClick={handlePlaceOrder}>
              {status === "placing" ? "Placing order..." : "Place order"}
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

export default CheckoutPage;
