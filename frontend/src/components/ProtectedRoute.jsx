import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "../services/authService";

function ProtectedRoute({ children, role }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setStatus("invalid");
        }
        return;
      }

      try {
        await validateToken(token);

        const currentRole = localStorage.getItem("role");

        if (role && currentRole !== role) {
          setStatus("invalid");
          return;
        }

        if (isMounted) {
          setStatus("valid");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error ) {
        localStorage.removeItem("token");

        if (isMounted) {
          setStatus("invalid");
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [role]);

  if (status === "checking") {
    return <div style={{ textAlign: "center", marginTop: "120px" }}>Validating session...</div>;
  }

  if (status === "invalid") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
