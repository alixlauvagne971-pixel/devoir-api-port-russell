import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

const fetchReservations = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN DASHBOARD =", token);

    const res = await api.get("/catways/1/reservations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("HEADERS ENVOYÉS =", `Bearer ${token}`);
    console.log("Réponse API :", res.data);
    setReservations(res.data.reservations);
  } catch (err) {
    console.error("Erreur API réservations :", err.response?.data || err.message);
  }
};

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);

    fetchReservations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="container-fluid dashboard">
      <div className="row bg-dark text-white p-3">
        <div className="col d-flex justify-content-between">
          <h4>⚓ Port Russell</h4>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-2 bg-light vh-100 p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">Tableau de bord</li>
            <li className="nav-item mb-2">Passerelles</li>
            <li className="nav-item mb-2">Réservations</li>
            <li className="nav-item mb-2">Utilisateurs</li>
            <li className="nav-item mb-2">Documentation</li>
          </ul>
        </div>

        <div className="col-10 p-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5>Bienvenue 👋</h5>
              <p><strong>Nom d'utilisateur :</strong> {user?.username}</p>
              <p><strong>E-mail :</strong> {user?.email}</p>
              <p><strong>Date :</strong> {today}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5>Réservations</h5>
              <p>Nombre de réservations : {reservations.length}</p>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Catway</th>
                    <th>Client</th>
                    <th>Bateau</th>
                    <th>Début</th>
                    <th>Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation, index) => (
                    <tr key={index}>
                      <td>{reservation.catwayNumber}</td>
                      <td>{reservation.clientName}</td>
                      <td>{reservation.boatName}</td>
                      <td>{reservation.startDate}</td>
                      <td>{reservation.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;