import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CartLink from "../components/CartLink";
import { addToCart, getCartCount } from "../services/cartService";
import { getProducts } from "../services/productService";
import "../styles/dashboard.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setStatus("loading");
      setMessage("");

      try {
        const response = await getProducts({ q: search, category, activeOnly });
        setProducts(response.data);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        setProducts([]);
        setMessage(error.response?.status === 401 ? "Session expired. Please login again." : "Unable to load products.");
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search, category, activeOnly]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getProducts({ activeOnly: true });
        const nextCategories = [
          ...new Set(
            response.data
              .map((product) => product.category?.trim())
              .filter(Boolean),
          ),
        ].sort((first, second) => first.localeCompare(second));

        setCategories(nextCategories);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartCount());

    syncCartCount();
    window.addEventListener("cart-updated", syncCartCount);

    return () => window.removeEventListener("cart-updated", syncCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("redirectTo");
    navigate("/login", { replace: true });
  };

  const handleProductLookup = async (event) => {
    event.preventDefault();

    if (!productId.trim()) {
      setMessage("Enter a product ID to search.");
      return;
    }

    navigate(`/products/${productId.trim()}`);
  };

  const openProductDetails = (id) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    addToCart(product);
    setCartCount(getCartCount());
    setMessage(`${product.name} added to cart.`);
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Product workspace</p>
          <h1>Products</h1>
          <p className="dashboard-copy">Search, filter, and inspect products from the secured backend API.</p>
        </div>

        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={() => navigate("/myorders")}>
            My orders
          </button>
          <CartLink count={cartCount} />
          <button className="logout-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="toolbar" aria-label="Product filters">
        <label className="field search-field">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, category, or description"
            type="search"
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            list="product-categories"
            placeholder="All categories"
          />
          <datalist id="product-categories">
            {categories.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>

        <label className="switch-field">
          <input checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} type="checkbox" />
          <span>Active only</span>
        </label>
      </section>

      <section className="lookup-panel">
        <form onSubmit={handleProductLookup}>
          <label className="field">
            <span>Find by ID</span>
            <input
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              inputMode="numeric"
              placeholder="Example: 1"
            />
          </label>
          <button className="primary-button" type="submit">
            Get product
          </button>
        </form>

      </section>

      {message && <p className="status-message">{message}</p>}

      <section className="product-grid" aria-busy={status === "loading"}>
        {status === "loading" && <p className="empty-state">Loading products...</p>}

        {status !== "loading" &&
          products.map((product) => (
            <article
              className="product-card"
              key={product.id}
              onClick={() => openProductDetails(product.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openProductDetails(product.id);
                }
              }}
              role="button"
              tabIndex="0"
            >
              <div className="product-image">
                {product.imageUrl ? <img alt={product.name} src={product.imageUrl} /> : <span>{getInitials(product.name)}</span>}
              </div>
              <div className="product-card-body">
                <div className="product-card-title">
                  <span className="product-id">#{product.id}</span>
                  <span className={product.isActive ? "active-pill" : "inactive-pill"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h2>{product.name}</h2>
                <p>{product.description || "No description available."}</p>
              </div>
              <div className="product-meta">
                <strong>{formatPrice(product.price)}</strong>
                <span>{product.stockQuantity ?? 0} in stock</span>
              </div>
              <button className="add-cart-button" type="button" onClick={(event) => handleAddToCart(event, product)}>
                Add to cart
              </button>
            </article>
          ))}
        {status === "ready" && products.length === 0 && <p className="empty-state">No products match your filters.</p>}
      </section>
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

export default DashboardPage;
