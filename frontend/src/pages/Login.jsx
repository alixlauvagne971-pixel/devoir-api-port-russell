import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("/login", {
                email,
                password,
            });

            // Si ton backend renvoie un token
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            // Si ton backend renvoie un user
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Erreur de connexion. Vérifie tes identifiants."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
            style={{
                background: "linear-gradient(135deg, #e9f2ff 0%, #f8f9fa 100%)",
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h1 className="h3 fw-bold text-dark mb-2">
                                        Port Russell
                                    </h1>
                                    <p className="text-muted mb-0">
                                        Connectez-vous à votre espace de gestion
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger text-center" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Adresse e-mail
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control form-control-lg"
                                            placeholder="exemple@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            Mot de passe
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="form-control form-control-lg"
                                            placeholder="Votre mot de passe"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg rounded-3"
                                            disabled={loading}
                                        >
                                            {loading ? "Connexion..." : "Se connecter"}
                                        </button>
                                    </div>

                                    <div className="text-center mt-3">
                                    <small>
                                        Pas de compte ?{" "}
                                        <span
                                        style={{ cursor: "pointer", color: "#0d6efd" }}
                                        onClick={() => navigate("/register")}
                                        >
                                        S'inscrire
                                        </span>
                                    </small>
                                    </div>
                                </form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <small className="text-muted">
                                        API privée de gestion des réservations du port
                                    </small>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-muted mt-3 mb-0 small">
                            © 2026 Port de Plaisance Russell
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;