import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addProduct, getProducts, updateProduct } from "../services/productService";
import "../styles/admin.css";

const INITIAL_PRODUCT = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: "",
  imageUrl: "",
  isActive: true,
};

function AdminPage() {
  const navigate = useNavigate();
  const formSectionRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_PRODUCT);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const totalStock = products.reduce((sum, product) => sum + Number(product.stockQuantity || 0), 0);
  const activeCount = products.filter((product) => product.isActive).length;

  const refreshCategories = async () => {
    const response = await getProducts({ activeOnly: false });
    const nextCategories = [
      ...new Set(
        response.data
          .map((product) => product.category?.trim())
          .filter(Boolean),
      ),
    ].sort((first, second) => first.localeCompare(second));

    setCategories(nextCategories);
  };

  const loadProducts = async () => {
    setStatus("loading");

    try {
      const response = await getProducts({ q: search, category, activeOnly });
      setProducts(response.data);
      setStatus("ready");
    } catch (error) {
      setProducts([]);
      setStatus("error");
      setMessage(error.response?.status === 401 ? "Admin session expired. Please login again." : "Unable to load products.");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMessage("");
      void loadProducts();
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search, category, activeOnly]);

  useEffect(() => {
    refreshCategories().catch(() => {
      setCategories([]);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("redirectTo");
    navigate("/login", { replace: true });
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(INITIAL_PRODUCT);
    setMessage("");
  };

  const handleStartEdit = (product) => {
    window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      stockQuantity: String(product.stockQuantity ?? ""),
      category: product.category ?? "",
      imageUrl: product.imageUrl ?? "",
      isActive: Boolean(product.isActive),
    });
    setEditingId(Number(product.id));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const idBeingEdited = editingId;
    const isEdit = idBeingEdited != null;

    const payload = {
      name: formData.name.trim(),
      description: (formData.description || "").trim(),
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      category: (formData.category || "").trim(),
      imageUrl: (formData.imageUrl || "").trim(),
      isActive: Boolean(formData.isActive),
    };

    try {
      if (isEdit) {
        await updateProduct(idBeingEdited, payload);
      } else {
        await addProduct(payload);
      }
      setEditingId(null);
      setFormData(INITIAL_PRODUCT);
      await refreshCategories();
      await loadProducts();
      setMessage(isEdit ? "Product updated successfully." : "Product added successfully.");
    } catch (error) {
      setMessage(parseApiError(error, isEdit ? "Unable to update product." : "Unable to add product."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Admin console</p>
          <h1>Product Management</h1>
          <p>Manage product inventory, create new items, and review the full catalog from one clean workspace.</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <section className="admin-stats" aria-label="Catalog summary">
        <article>
          <span>Total products</span>
          <strong>{products.length}</strong>
        </article>
        <article>
          <span>Active products</span>
          <strong>{activeCount}</strong>
        </article>
        <article>
          <span>Total stock</span>
          <strong>{totalStock}</strong>
        </article>
      </section>

      <section className="admin-layout">
        <form ref={formSectionRef} className="admin-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{editingId != null ? "Editing" : "New product"}</p>
            <h2>{editingId != null ? `Edit product #${editingId}` : "Add Product"}</h2>
          </div>

          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product name" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="4" />

          <div className="split-fields">
            <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" min="1" step="0.01" type="number" required />
            <input name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Stock" min="0" type="number" required />
          </div>

          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" />

          <label className="admin-check">
            <input name="isActive" checked={formData.isActive} onChange={handleChange} type="checkbox" />
            <span>Product is active</span>
          </label>

          <div className="admin-form-actions">
            {editingId != null && (
              <button type="button" className="admin-cancel-button" onClick={handleCancelEdit} disabled={isSubmitting}>
                Cancel edit
              </button>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingId != null ? "Save changes" : "Add Product"}
            </button>
          </div>
        </form>

        <section className="admin-products">
          <div className="admin-products-header">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>All Products</h2>
            </div>
          </div>

          <div className="admin-filters">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" type="search" />
            <input value={category} onChange={(event) => setCategory(event.target.value)} list="admin-categories" placeholder="Filter category" />
            <datalist id="admin-categories">
              {categories.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <label>
              <input checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} type="checkbox" />
              Active only
            </label>
          </div>

          {message && <p className="admin-message">{message}</p>}

          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {status !== "loading" &&
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category || "Uncategorized"}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stockQuantity ?? 0}</td>
                      <td>
                        <span className={product.isActive ? "active-pill" : "inactive-pill"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleStartEdit(product);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {status === "loading" && <p className="admin-empty">Loading products...</p>}
            {status === "ready" && products.length === 0 && <p className="admin-empty">No products found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value || 0));
}

function parseApiError(error, fallback) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (!data) {
    return status === 0 || error.code === "ERR_NETWORK"
      ? "Cannot reach server. Is the backend running on port 8080?"
      : fallback;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (Array.isArray(data.errors) && data.errors.length) {
    const parts = data.errors.map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (item && typeof item === "object") {
        return item.defaultMessage || item.message || item.field + ": " + (item.defaultMessage || "");
      }
      return String(item);
    });
    return parts.filter(Boolean).join(" ");
  }

  if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    return Object.entries(data.errors)
      .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
      .join(" ");
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (status === 401) {
    return "Session expired. Please login again.";
  }

  return fallback;
}

export default AdminPage;
