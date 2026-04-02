import { useEffect, useState } from "react";
import api from "../api";
import NavBar from "../composent/navBar";
import ReservationModal from "../composent/ReservationModal";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

      console.log("Réservations :", res.data);

      setReservations(res.data.reservations || res.data);
    } catch (err) {
      console.error(
        "Erreur récupération réservations :",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");

    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }

    fetchReservations();
  }, []);

  const today = new Date().toLocaleDateString();

  return (
    <>
    <div className="container-fluid p-0">
      <div className="row">

        <NavBar />

        <div className="col-10 p-4 bg-light min-vh-100">

          <h1 className="fw-bold mb-2">Réservations</h1>
          <p className="text-muted mb-4">
            Gestion des réservations du port
          </p>

          {/* CARD USER */}
          <div className="card mb-4 border-0 shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="fw-bold">Utilisateur connecté</h5>
              <p className="mb-1"><strong>Nom :</strong> {user?.username}</p>
              <p className="mb-1"><strong>Email :</strong> {user?.email}</p>
              <p><strong>Date :</strong> {today}</p>
            </div>
          </div>

          {/* CARD RESERVATIONS */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                    Liste des réservations ({Array.isArray(reservations) ? reservations.length : 0})
                </h5>

                <button className="btn btn-primary rounded-3 px-4"
                        onClick={() => setShowModal(true)}>
                    + Ajouter
                </button>
                </div>

              <table className="table table-hover align-middle">
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
                  {reservations.map((r, index) => (
                    <tr key={index}>
                      <td>{r.catwayNumber}</td>
                      <td>{r.clientName}</td>
                      <td>{r.boatName}</td>
                      <td>{new Date(r.startDate).toLocaleDateString()}</td>
                      <td>{new Date(r.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
          <ReservationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchReservations}
      />
    </>
  );
}

export default Reservations;