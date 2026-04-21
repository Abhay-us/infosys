import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/register.css";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // POPUP STATE
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    success: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    if (!formData.name.trim()) {
      showPopup("Validation Error", "Name is required");
      return false;
    }

    if (!formData.email.includes("@")) {
      showPopup("Validation Error", "Invalid email");
      return false;
    }

    if (formData.phone.length < 10) {
      showPopup("Validation Error", "Invalid phone number");
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

    if (!validateForm()) {
      return;
    }

    try {
      // BACKEND UNCHANGED
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await registerUser(payload);

      showPopup(
        "Registration Successful",
        "Your account has been created successfully.",
        true,
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        showPopup("Registration Failed", JSON.stringify(error.response.data));
      } else {
        showPopup("Connection Error", "Server connection error");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src="/register-illustration.png" alt="Register" />

        <h1>Join Us Today</h1>

        <p>Create your account and start your journey.</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Register</button>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>

      {/* POPUP MODAL */}

      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{popup.title}</h2>

            <p>{popup.message}</p>

            {popup.success && (
              <button
                className="popup-login"
                onClick={() => navigate("/login")}
              >
                Go To Login
              </button>
            )}

            <button
              className="popup-close"
              onClick={() =>
                setPopup({
                  ...popup,
                  show: false,
                })
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
