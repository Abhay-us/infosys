import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/register.css";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // POPUP STATE
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    });
  };

  const showPopup = (title, message, success = false) => {
    setPopup({
      show: true,
      title,
      message,
      success,
    });
  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (!trimmedName) {
      showPopup("Validation Error", "Name is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showPopup("Validation Error", "Invalid email");
      return false;
    }

    if (phoneDigits.length !== 10) {
      showPopup("Validation Error", "Phone number must be exactly 10 digits");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      showPopup(
        "Validation Error",
        "Password must contain uppercase, lowercase, number and special character",
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showPopup("Validation Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
      };

      await registerUser(payload);

      showPopup(
        "Registration Successful",
        "Your account has been created successfully.",
        true,
      );

      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error(error);

      if (error.response) {
        const { data, status } = error.response;
        const message =
          typeof data === "string"
            ? data
            : data?.message ||
              data?.error ||
              (status === 409
                ? "An account with this email already exists"
                : "Registration failed. Please try again.");

        showPopup("Registration Failed", message);
      } else {
        showPopup("Connection Error", "Server connection error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="register-subtitle">
          Fill in your details to create a new account.
        </p>

        {popup.show && (
          <div
            className={`form-message ${popup.success ? "success" : "error"}`}
          >
            <strong>{popup.title}</strong>
            <span>{popup.message}</span>
          </div>
        )}

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          inputMode="numeric"
          maxLength="10"
          autoComplete="tel"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
