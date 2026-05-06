import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../services/productService";
import "../styles/dashboard.css";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const fetchProductDetails = useCallback(async (id) => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await getProductById(id);
      setProduct(response.data);
      setStatus("ready");
    } catch (error) {
      setProduct(null);
      setStatus("error");
      setMessage(error.response?.status === 404 ? "No product found with that ID." : "Unable to load product details.");
    }
  }, []);

  useEffect(() => {
    if (!productId) {
      navigate("/products", { replace: true });
      return;
    }

    fetchProductDetails(productId);
  }, [fetchProductDetails, navigate, productId]);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Product details</p>
          <h1>{product ? product.name : "Product"}</h1>
          <p className="dashboard-copy">View full product data from the secured backend API.</p>
        </div>

        <Link className="logout-button" to="/products">
          Back to products
        </Link>
      </section>

      {message && <p className="status-message">{message}</p>}

      {status === "loading" && <p className="empty-state">Loading product details...</p>}

      {status === "error" && !message && <p className="empty-state">Unable to load product details.</p>}

      {status === "ready" && product && (
        <section className="product-modal" role="region" aria-label="Product details">
          <div className="modal-content">
            <div className="modal-image">
              {product.imageUrl ? <img alt={product.name} src={product.imageUrl} /> : <span>{getInitials(product.name)}</span>}
            </div>

            <div className="modal-details">
              <div className="product-card-title">
                <span className="product-id">Product #{product.id}</span>
                <span className={product.isActive ? "active-pill" : "inactive-pill"}>{product.isActive ? "Active" : "Inactive"}</span>
              </div>

              <h2>{product.name}</h2>
              <p className="modal-category">{product.category || "Uncategorized"}</p>
              <p className="modal-description">{product.description || "No full description available for this product."}</p>

              <div className="modal-metrics">
                <article>
                  <span>Price</span>
                  <strong>{formatPrice(product.price)}</strong>
                </article>
                <article>
                  <span>Stock</span>
                  <strong>{product.stockQuantity ?? 0}</strong>
                </article>
              </div>
            </div>
          </div>
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

export default ProductDetailsPage;
