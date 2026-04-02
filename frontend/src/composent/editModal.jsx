import { useEffect, useState } from "react";
import api from "../api";

function EditModal({ show, onClose, reservation, onSuccess }) {
  const [formData, setFormData] = useState({
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        clientName: reservation.clientName || "",
        boatName: reservation.boatName || "",
        startDate: reservation.startDate
          ? new Date(reservation.startDate).toISOString().slice(0, 10)
          : "",
        endDate: reservation.endDate
          ? new Date(reservation.endDate).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      await api.put(
        `/catways/${reservation.catwayNumber}/reservations/${reservation._id}`,
        formData,
        config
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Erreur modification réservation :",
        error.response?.data || error.message
      );
    }
  };

  if (!show || !reservation) return null;

  return (
    <div
  className="modal d-block modal-backdrop-blur"
  tabIndex="-1"
  style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="modal-header border-0 px-4 pt-4 pb-3">
            <h5 className="modal-title fw-bold fs-4">Modifier la réservation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-2">
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Nom du client</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Nom du bateau</label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2"
                  name="boatName"
                  value={formData.boatName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Date de début</label>
                <input
                  type="date"
                  className="form-control rounded-3 py-2"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Date de fin</label>
                <input
                  type="date"
                  className="form-control rounded-3 py-2"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary rounded-3 px-4 fw-semibold">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;