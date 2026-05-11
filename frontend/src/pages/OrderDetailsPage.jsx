import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { getMyOrder } from "../services/orderService";
import "../styles/dashboard.css";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [status, setStatus] = useState(location.state?.order ? "ready" : "loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (order) {
      return;
    }

    const loadOrder = async () => {
      setStatus("loading");
      setMessage("");

      try {
        const response = await getMyOrder(orderId);
        setOrder(response.data);
        setStatus("ready");
      } catch {
        setStatus("error");
        setMessage("Unable to load order details.");
      }
    };

    loadOrder();
  }, [order, orderId]);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Order details</p>
          <h1>{order ? `Order #${order.id}` : "Order"}</h1>
          <p className="dashboard-copy">Products, quantities, and final total for this order.</p>
        </div>

        <div className="header-actions">
          <Link className="secondary-button" to="/myorders">
            My orders
          </Link>
          <Link className="logout-button" to="/products">
            Products
          </Link>
        </div>
      </section>

      {message && <p className="status-message">{message}</p>}
      {status === "loading" && <p className="empty-state">Loading order details...</p>}

      {status === "ready" && order && (
        <section className="order-details-layout">
          <div className="cart-items">
            {order.items.map((item) => (
              <article className="cart-item" key={item.productId}>
                <div className="cart-item-image">
                  {item.imageUrl ? <img alt={item.productName} src={item.imageUrl} /> : <span>{getInitials(item.productName)}</span>}
                </div>
                <div className="cart-item-details">
                  <span className="product-id">#{item.productId}</span>
                  <h2>{item.productName}</h2>
                  <p>{item.category || "Uncategorized"}</p>
                  <strong>{formatPrice(item.unitPrice)}</strong>
                </div>
                <div className="order-line-total">
                  <span>Qty {item.quantity}</span>
                  <strong>{formatPrice(item.lineTotal)}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>
            <div className="summary-row summary-total">
              <span>Total price</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
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

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-IN") : "Not available";
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

export default OrderDetailsPage;
