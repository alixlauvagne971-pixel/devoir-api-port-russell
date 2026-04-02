  import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="col-2 bg-dark text-white min-vh-100 p-4 shadow-sm">

      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white rounded px-3 py-2 fw-medium">
            Tableau de bord
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link to="/catways" className="nav-link text-white rounded px-3 py-2 fw-medium">
            Passerelles
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link to="/reservations" className="nav-link text-white rounded px-3 py-2 fw-medium">
            Réservations
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link to="/users" className="nav-link text-white rounded px-3 py-2 fw-medium">
            Utilisateurs
          </Link>
        </li>

        <li className="nav-item mb-3">
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="nav-link text-white"
          >
            Documentation
          </a>
        </li>

        <li className="nav-item mt-4">
          <button onClick={handleLogout} className="btn btn-danger w-100 mt-4 rounded-3 fw-semibold">
            Déconnexion
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;