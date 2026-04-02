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
    <div className="modal d-block" style={{ background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(3px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div>
                <h4 className="modal-title fw-bold mb-1">Nouvelle réservation</h4>
                <p className="text-muted mb-0 small">Ajoutez une réservation pour un catway</p>
            </div>
                <button className="btn-close" onClick={onClose}></button>
            </div>

          <div className="modal-body">

            <input
              className="form-control rounded-3 py-2 mb-3"
              placeholder="Catway"
              name="catwayNumber"
              onChange={handleChange}
            />

            <input
              className="form-control rounded-3 py-2 mb-3"
              placeholder="Client"
              name="clientName"
              onChange={handleChange}
            />

            <input
              className="form-control rounded-3 py-2 mb-3"
              placeholder="Bateau"
              name="boatName"
              onChange={handleChange}
            />

<div className="row">
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">Date de début</label>
    <input
      type="date"
      className="form-control rounded-3 py-2"
      name="startDate"
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">Date de fin</label>
    <input
      type="date"
      className="form-control rounded-3 py-2"
      name="endDate"
      onChange={handleChange}
    />
  </div>
</div>

          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center">
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