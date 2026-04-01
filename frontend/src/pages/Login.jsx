import { useState } from "react";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log("Réponse login :", response.data);
    } catch (err) {
      console.error("Erreur login :", err);
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;