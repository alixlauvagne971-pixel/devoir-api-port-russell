import { useState } from "react";
import api from "../api";


function ReservationModal({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({
    catwayNumber: "",
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/catways/${form.catwayNumber}/reservations`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(); // refresh liste
      onClose();   // fermer modale
    } catch (err) {
      console.error("Erreur création :", err.response?.data || err.message);
    }
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Ajouter une réservation</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <input
              className="form-control mb-2"
              placeholder="Catway"
              name="catwayNumber"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Client"
              name="clientName"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Bateau"
              name="boatName"
              onChange={handleChange}
            />

            <input
              type="date"
              className="form-control mb-2"
              name="startDate"
              onChange={handleChange}
            />

            <input
              type="date"
              className="form-control"
              name="endDate"
              onChange={handleChange}
            />

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>

            <button className="btn btn-primary" onClick={handleSubmit}>
              Enregistrer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ReservationModal;