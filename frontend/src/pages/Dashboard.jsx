import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data.user);
      } catch (err) {
        console.error("Utilisateur non connecté :", err);
        navigate("/");
      }
    };

    fetchMe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.get("/logout");
      navigate("/");
    } catch (err) {
      console.error("Erreur logout :", err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p>Bienvenue {user.username}</p>
          <p>Email : {user.email}</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default Dashboard;