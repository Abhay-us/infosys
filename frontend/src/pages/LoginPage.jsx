import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const showPopup = (message, success = false) => {
    setPopup({
      show: true,
      message,
      success,
    });

    // Auto close after 1 second
    setTimeout(() => {
      setPopup({
        show: false,
        message: "",
        success: false,
      });

      if (success) {
        navigate("/dashboard");
      }
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      localStorage.setItem("token", response.data);

      // KEEP POPUP
      showPopup("Login Successful", true);
    } catch (error) {
      // KEEP POPUP
      showPopup("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT IMAGE SIDE */}
      <div className="login-left">
        <h1>Welcome Back</h1>

        <p>Login to continue managing your account.</p>
      </div>

      {/* RIGHT FORM */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/")}
        >
          Don't have an account? Sign Up
        </button>
      </form>

      {/* POPUP (UNCHANGED) */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{popup.success ? "Success" : "Error"}</h2>

            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
