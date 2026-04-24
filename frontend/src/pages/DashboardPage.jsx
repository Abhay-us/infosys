import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "150px",
        fontFamily: "Arial, sans-serif",
        padding: "0 20px",
      }}
    >
      <h1>Login Successful</h1>

      <h2>Welcome to the Dashboard</h2>

      <p
        style={{
          fontSize: "18px",
          color: "#555",
          marginTop: "12px",
        }}
      >
        Welcome. You have logged in successfully.
      </p>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#111827",
          color: "#ffffff",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
