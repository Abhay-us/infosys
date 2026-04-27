import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, validateToken } from "../services/authService";
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const checkExistingSession = async () => {
      try {
        await validateToken(token);
        navigate("/dashboard", { replace: true });
      } catch {
        localStorage.removeItem("token");
      }
    };

    checkExistingSession();
  }, [navigate]);

  const closePopup = () => {
    setPopup({
      show: false,
      message: "",
      success: false,
    });
  };

  const showPopup = (message, success = false) => {
    setPopup({
      show: true,
      message,
      success,
    });

    // Auto close after 1 second
    setTimeout(() => {
      closePopup();

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
      console.error("Login error:", error);
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
          onClick={() => navigate("/register")}
        >
          Don't have an account? Sign Up
        </button>
      </form>

      {/* POPUP (UNCHANGED) */}
      {popup.show && (
        <div className="popup-overlay">
          <div
            className={`popup-box ${popup.success ? "popup-success" : "popup-error"}`}
          >
            <h2>{popup.success ? "Success" : "Error"}</h2>

            <p>{popup.message}</p>

            <button type="button" className="popup-close-btn" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
