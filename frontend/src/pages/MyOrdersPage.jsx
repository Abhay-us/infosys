import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../services/orderService";
import "../styles/dashboard.css";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setStatus("loading");
      setMessage("");

      try {
        const response = await getMyOrders();
        setOrders(response.data);
        setStatus("ready");
      } catch {
        setOrders([]);
        setStatus("error");
        setMessage("Unable to load orders.");
      }
    };

    loadOrders();
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">My orders</p>
          <h1>Placed orders</h1>
          <p className="dashboard-copy">View every order you have placed from checkout.</p>
        </div>

        <Link className="logout-button" to="/products">
          Back to products
        </Link>
      </section>

      {message && <p className="status-message">{message}</p>}
      {status === "loading" && <p className="empty-state">Loading orders...</p>}

      {status === "ready" && orders.length === 0 && (
        <section className="cart-empty">
          <h2>No orders yet</h2>
          <p>Placed orders will appear here after checkout.</p>
          <Link className="primary-button cart-empty-action" to="/products">
            Browse products
          </Link>
        </section>
      )}

      {status === "ready" && orders.length > 0 && (
        <section className="orders-list" aria-label="Placed orders">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <span className="product-id">Order #{order.id}</span>
                <h2>{formatPrice(order.totalPrice)}</h2>
                <p>{order.items.length} product{order.items.length === 1 ? "" : "s"} placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-card-actions">
                <span className="active-pill">{order.status}</span>
                <Link className="primary-button" to={`/orders/${order.id}`} state={{ order }}>
                  View details
                </Link>
              </div>
            </article>
          ))}
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

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-IN") : "Not available";
}

export default MyOrdersPage;
