import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCheckoutAddress, saveCheckoutAddress } from "../services/addressService";
import "../styles/dashboard.css";

const emptyAddress = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  pincode: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  addressType: "Home",
  isDefault: true,
};

function AddressPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState(() => ({ ...emptyAddress, ...getCheckoutAddress() }));
  const [message, setMessage] = useState("");

  const requiredFields = useMemo(
    () => [
      ["fullName", "Full name"],
      ["phone", "Mobile number"],
      ["pincode", "Pincode"],
      ["house", "House / flat details"],
      ["street", "Area / street"],
      ["city", "City"],
      ["state", "State"],
    ],
    [],
  );

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setAddress((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missingField = requiredFields.find(([key]) => !String(address[key] || "").trim());

    if (missingField) {
      setMessage(`${missingField[1]} is required.`);
      return;
    }

    if (!/^\d{10}$/.test(address.phone.trim())) {
      setMessage("Enter a valid 10 digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setMessage("Enter a valid 6 digit pincode.");
      return;
    }

    saveCheckoutAddress({
      ...address,
      fullName: address.fullName.trim(),
      phone: address.phone.trim(),
      alternatePhone: address.alternatePhone.trim(),
      pincode: address.pincode.trim(),
      house: address.house.trim(),
      street: address.street.trim(),
      landmark: address.landmark.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      country: address.country.trim() || "India",
    });
    navigate("/checkout", { replace: true });
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Delivery address</p>
          <h1>Add address</h1>
          <p className="dashboard-copy">Enter the full delivery details the buyer uses for ecommerce checkout.</p>
        </div>

        <Link className="logout-button" to="/checkout">
          Back to checkout
        </Link>
      </section>

      {message && <p className="status-message">{message}</p>}

      <form className="address-form-panel" onSubmit={handleSubmit}>
        <section className="address-form-section">
          <h2>Contact details</h2>
          <div className="address-form-grid">
            <label className="field">
              Full name
              <input name="fullName" value={address.fullName} onChange={handleChange} placeholder="Receiver name" />
            </label>
            <label className="field">
              Mobile number
              <input
                inputMode="numeric"
                maxLength="10"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
              />
            </label>
            <label className="field">
              Alternate number
              <input
                inputMode="numeric"
                maxLength="10"
                name="alternatePhone"
                value={address.alternatePhone}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>
          </div>
        </section>

        <section className="address-form-section">
          <h2>Address details</h2>
          <div className="address-form-grid">
            <label className="field">
              Pincode
              <input
                inputMode="numeric"
                maxLength="6"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="6 digit pincode"
              />
            </label>
            <label className="field">
              House / flat / building
              <input name="house" value={address.house} onChange={handleChange} placeholder="House no, floor, building" />
            </label>
            <label className="field address-wide-field">
              Area / street / sector
              <input name="street" value={address.street} onChange={handleChange} placeholder="Street, colony, sector" />
            </label>
            <label className="field">
              Landmark
              <input name="landmark" value={address.landmark} onChange={handleChange} placeholder="Nearby landmark" />
            </label>
            <label className="field">
              City
              <input name="city" value={address.city} onChange={handleChange} placeholder="City" />
            </label>
            <label className="field">
              State
              <input name="state" value={address.state} onChange={handleChange} placeholder="State" />
            </label>
            <label className="field">
              Country
              <input name="country" value={address.country} onChange={handleChange} placeholder="Country" />
            </label>
          </div>
        </section>

        <section className="address-form-section">
          <h2>Address type</h2>
          <div className="address-type-options">
            <label>
              <input
                checked={address.addressType === "Home"}
                name="addressType"
                type="radio"
                value="Home"
                onChange={handleChange}
              />
              Home
            </label>
            <label>
              <input
                checked={address.addressType === "Work"}
                name="addressType"
                type="radio"
                value="Work"
                onChange={handleChange}
              />
              Work
            </label>
            <label>
              <input
                checked={address.addressType === "Other"}
                name="addressType"
                type="radio"
                value="Other"
                onChange={handleChange}
              />
              Other
            </label>
          </div>
          <label className="switch-field">
            <input checked={address.isDefault} name="isDefault" type="checkbox" onChange={handleChange} />
            Use this as default delivery address
          </label>
        </section>

        <div className="address-form-actions">
          <button className="primary-button" type="submit">
            Save address
          </button>
          <Link className="secondary-button" to="/checkout">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default AddressPage;
