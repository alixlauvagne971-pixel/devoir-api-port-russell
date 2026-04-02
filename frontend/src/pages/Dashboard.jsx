import { useEffect, useState } from "react";
import api from "../api";
import NavBar from "../composent/navBar";


function Dashboard() {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

const fetchReservations = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const res = await api.get("/reservations", config);
    console.log("Réponse API :", res.data);
    setReservations(res.data.reservations);
  } catch (err) {
    console.error("Erreur API réservations :", err.response?.data || err.message);
  }
};

useEffect(() => {
  const userFromStorage = localStorage.getItem("user");

  if (userFromStorage) {
    const parsedUser = JSON.parse(userFromStorage);
    setUser(parsedUser);
  }

  fetchReservations();
}, []);


  const today = new Date().toLocaleDateString();

  return (
    <div className="container-fluid p-0 dashboard">
      <div className="container-fluid">
        <div className="row">
          
          <NavBar />

          <div className="col-10 p-4 bg-light min-vh-100">
            <h1 className="fw-bold mb-2">Tableau de bord</h1>
            <p className="text-muted mb-4">Bienvenue sur le tableau de bord du port de plaisance Russell.</p>

            <div className="card mb-4 border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h2 className="fw-bold mb-3">Bienvenue 👋</h2>
                <p><strong>Nom d'utilisateur :</strong> {user?.username}</p>
                <p><strong>E-mail :</strong> {user?.email}</p>
                <p><strong>Date :</strong> {today}</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h2 className="fw-bold mb-3">Réservations</h2>
                <p>Nombre de réservations : {reservations.length}</p>

                <table className="table table-hover align-middle mt-3">
                  <thead className="table-light">
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
                        <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                        <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;