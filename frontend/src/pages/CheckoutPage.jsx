import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { formatCheckoutAddress, getCheckoutAddress } from "../services/addressService";
import { clearCart, getCartItems } from "../services/cartService";
import { checkout } from "../services/orderService";
import "../styles/dashboard.css";

const paymentOptions = [
  {
    value: "UPI",
    title: "UPI",
    copy: "Pay using PhonePe, Google Pay, Paytm, or any UPI app.",
  },
  {
    value: "CARD",
    title: "Credit / debit card",
    copy: "Use Visa, Mastercard, RuPay, or other bank cards.",
  },
  {
    value: "NET_BANKING",
    title: "Net banking",
    copy: "Choose your bank and complete payment securely.",
  },
  {
    value: "CASH_ON_DELIVERY",
    title: "Cash on delivery",
    copy: "Pay when your order arrives at your doorstep.",
  },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCartItems());
  const [deliveryAddress, setDeliveryAddress] = useState(() => getCheckoutAddress());
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    bank: "",
  });
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const syncCartItems = () => setItems(getCartItems());

    window.addEventListener("cart-updated", syncCartItems);

    return () => window.removeEventListener("cart-updated", syncCartItems);
  }, []);

  useEffect(() => {
    const syncAddress = () => setDeliveryAddress(getCheckoutAddress());

    window.addEventListener("address-updated", syncAddress);

    return () => window.removeEventListener("address-updated", syncAddress);
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [items]);

  const handlePaymentDetailChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    const formattedAddress = formatCheckoutAddress(deliveryAddress);

    if (!formattedAddress) {
      setMessage("Add a delivery address before placing the order.");
      return;
    }

    const paymentError = getPaymentError(paymentMode, paymentDetails);

    if (paymentError) {
      setMessage(paymentError);
      return;
    }

    setStatus("placing");
    setMessage("");

    try {
      const response = await checkout(items, {
        deliveryAddress: formattedAddress,
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
            <section className="checkout-address-box">
              <div>
                <span>Delivery address</span>
                {deliveryAddress ? (
                  <>
                    <strong>{deliveryAddress.fullName}</strong>
                    <p>{formatCheckoutAddress(deliveryAddress).split("\n").slice(1).join("\n")}</p>
                  </>
                ) : (
                  <p>No delivery address added.</p>
                )}
              </div>
              <Link className="secondary-button" to="/checkout/address">
                {deliveryAddress ? "Edit address" : "Add address"}
              </Link>
            </section>
            <section className="payment-panel" aria-label="Payment method">
              <div className="payment-panel-header">
                <span>Payment method</span>
                <strong>{paymentOptions.find((option) => option.value === paymentMode)?.title}</strong>
              </div>

              <div className="payment-options">
                {paymentOptions.map((option) => (
                  <label className={`payment-option ${paymentMode === option.value ? "payment-option-active" : ""}`} key={option.value}>
                    <input
                      checked={paymentMode === option.value}
                      name="paymentMode"
                      type="radio"
                      value={option.value}
                      onChange={(event) => setPaymentMode(event.target.value)}
                    />
                    <span>
                      <strong>{option.title}</strong>
                      <small>{option.copy}</small>
                    </span>
                  </label>
                ))}
              </div>

              {paymentMode === "UPI" && (
                <div className="payment-details">
                  <label className="field">
                    UPI ID
                    <input
                      name="upiId"
                      value={paymentDetails.upiId}
                      onChange={handlePaymentDetailChange}
                      placeholder="name@bank"
                    />
                  </label>
                  <p>After placing the order, verify the payment request in your UPI app.</p>
                </div>
              )}

              {paymentMode === "CARD" && (
                <div className="payment-details">
                  <label className="field">
                    Card number
                    <input
                      inputMode="numeric"
                      maxLength="19"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentDetailChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                  <label className="field">
                    Name on card
                    <input
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={handlePaymentDetailChange}
                      placeholder="Cardholder name"
                    />
                  </label>
                  <div className="payment-card-row">
                    <label className="field">
                      Expiry
                      <input
                        maxLength="5"
                        name="cardExpiry"
                        value={paymentDetails.cardExpiry}
                        onChange={handlePaymentDetailChange}
                        placeholder="MM/YY"
                      />
                    </label>
                    <label className="field">
                      CVV
                      <input
                        inputMode="numeric"
                        maxLength="4"
                        name="cardCvv"
                        type="password"
                        value={paymentDetails.cardCvv}
                        onChange={handlePaymentDetailChange}
                        placeholder="CVV"
                      />
                    </label>
                  </div>
                </div>
              )}

              {paymentMode === "NET_BANKING" && (
                <div className="payment-details">
                  <label className="field">
                    Select bank
                    <select name="bank" value={paymentDetails.bank} onChange={handlePaymentDetailChange}>
                      <option value="">Choose bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </label>
                </div>
              )}

              {paymentMode === "CASH_ON_DELIVERY" && (
                <div className="payment-details payment-note">
                  <strong>Pay at delivery</strong>
                  <p>Keep exact cash or a supported payment option ready when the delivery partner arrives.</p>
                </div>
              )}
            </section>
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

function getPaymentError(paymentMode, paymentDetails) {
  if (paymentMode === "UPI" && !/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId.trim())) {
    return "Enter a valid UPI ID.";
  }

  if (paymentMode === "CARD") {
    const cardNumber = paymentDetails.cardNumber.replace(/\s/g, "");

    if (!/^\d{12,19}$/.test(cardNumber)) {
      return "Enter a valid card number.";
    }

    if (!paymentDetails.cardName.trim()) {
      return "Name on card is required.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.cardExpiry.trim())) {
      return "Enter card expiry in MM/YY format.";
    }

    if (!/^\d{3,4}$/.test(paymentDetails.cardCvv.trim())) {
      return "Enter a valid CVV.";
    }
  }

  if (paymentMode === "NET_BANKING" && !paymentDetails.bank) {
    return "Select a bank for net banking.";
  }

  return "";
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
