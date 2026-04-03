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
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm({ ...form, [name]: value });

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));

  setApiError("");
};

const validateForm = () => {
  const newErrors = {};

  if (!form.catwayNumber.trim()) {
    newErrors.catwayNumber = "Le numéro du catway est requis.";
  } else if (isNaN(Number(form.catwayNumber))) {
    newErrors.catwayNumber = "Le numéro du catway doit être un nombre.";
  }

  if (!form.clientName.trim()) {
    newErrors.clientName = "Le nom du client est requis.";
  }

  if (!form.boatName.trim()) {
    newErrors.boatName = "Le nom du bateau est requis.";
  }

  if (!form.startDate) {
    newErrors.startDate = "La date de début est requise.";
  }

  if (!form.endDate) {
    newErrors.endDate = "La date de fin est requise.";
  }

  if (form.startDate && form.endDate) {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start >= end) {
      newErrors.endDate = "La date de fin doit être après la date de début.";
    }
  }

  return newErrors;
};

const resetForm = () => {
  setForm({
    catwayNumber: "",
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
  });

  setErrors({});
  setApiError("");
};

const handleClose = () => {
  resetForm();
  onClose();
};

const handleSubmit = async () => {
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setApiError("");
    return;
  }

  try {
    setIsSubmitting(true);
    setApiError("");
    setErrors({});

    const token = localStorage.getItem("token");

    await api.post(
      `/catways/${form.catwayNumber}/reservations`,
      {
        clientName: form.clientName,
        boatName: form.boatName,
        startDate: form.startDate,
        endDate: form.endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setForm({
      catwayNumber: "",
      clientName: "",
      boatName: "",
      startDate: "",
      endDate: "",
    });
    resetForm();
    onSuccess();
    onClose();
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Une erreur est survenue lors de la création de la réservation.";

    setApiError(message);
  } finally {
    setIsSubmitting(false);
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
                <button
                  className="btn-close"
                  onClick={onClose}
                  disabled={isSubmitting}
                ></button>
            </div>

          <div className="modal-body">
            {apiError && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {apiError}
              </div>
            )}

            <input
              type="number"
              className={`form-control rounded-3 py-2 mb-1 ${errors.catwayNumber ? "is-invalid" : ""}`}
              placeholder="Catway"
              name="catwayNumber"
              value={form.catwayNumber}
              onChange={handleChange}
            />
            {errors.catwayNumber && (
              <div className="invalid-feedback d-block mb-2">
                {errors.catwayNumber}
              </div>
            )}

            <input
              className={`form-control rounded-3 py-2 mb-1 ${errors.clientName ? "is-invalid" : ""}`}
              placeholder="Client"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
            />
            {errors.clientName && (
              <div className="invalid-feedback d-block mb-2">
                {errors.clientName}
              </div>
            )}

            <input
              className={`form-control rounded-3 py-2 mb-1 ${errors.boatName ? "is-invalid" : ""}`}
              placeholder="Bateau"
              name="boatName"
              value={form.boatName}
              onChange={handleChange}
            />
            {errors.boatName && (
              <div className="invalid-feedback d-block mb-2">
                {errors.boatName}
              </div>
            )}

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Date de début</label>
                <input
                  type="date"
                  className={`form-control rounded-3 py-2 ${errors.startDate ? "is-invalid" : ""}`}
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && (
                  <div className="invalid-feedback d-block">
                    {errors.startDate}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Date de fin</label>
                <input
                  type="date"
                  className={`form-control rounded-3 py-2 ${errors.endDate ? "is-invalid" : ""}`}
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && (
                  <div className="invalid-feedback d-block">
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center">
            <button className="btn btn-secondary" onClick={handleClose}>
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