import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/users", {
        username,
        email,
        password,
      });

      setSuccess("Compte créé avec succès !");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-11 col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h2 className="text-center mb-3">Créer un compte</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nom d'utilisateur</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label>Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-success w-100">
              S'inscrire
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Déjà un compte ?{" "}
              <span
                style={{ cursor: "pointer", color: "#0d6efd" }}
                onClick={() => navigate("/")}
              >
                Se connecter
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;