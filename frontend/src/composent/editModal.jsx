import { useEffect, useState } from "react";
import api from "../api";

function EditModal({ show, onClose, reservation, onSuccess }) {
  const [formData, setFormData] = useState({
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
  });

const [errors, setErrors] = useState({});
const [apiError, setApiError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

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

  const resetForm = () => {
  setErrors({});
  setApiError("");

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
  } else {
    setFormData({
      clientName: "",
      boatName: "",
      startDate: "",
      endDate: "",
    });
  }
};

const handleClose = () => {
  resetForm();
  onClose();
};

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));

  setApiError("");
};

  const validateForm = () => {
  const newErrors = {};

  if (!formData.clientName.trim()) {
    newErrors.clientName = "Le nom du client est requis.";
  }

  if (!formData.boatName.trim()) {
    newErrors.boatName = "Le nom du bateau est requis.";
  }

  if (!formData.startDate) {
    newErrors.startDate = "La date de début est requise.";
  }

  if (!formData.endDate) {
    newErrors.endDate = "La date de fin est requise.";
  }

  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start >= end) {
      newErrors.endDate = "La date de fin doit être après la date de début.";
    }
  }

  return newErrors;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setApiError("");
    return;
  }

  try {
    setIsSubmitting(true);
    setErrors({});
    setApiError("");

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

    resetForm();
    onSuccess();
    onClose();
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Une erreur est survenue lors de la modification de la réservation.";

    setApiError(message);
  } finally {
    setIsSubmitting(false);
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
              onClick={handleClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-2">
              {apiError && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {apiError}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Nom du client</label>
                <input
                    type="text"
                    className={`form-control rounded-3 py-2 ${errors.clientName ? "is-invalid" : ""}`}
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                  {errors.clientName && (
                    <div className="invalid-feedback d-block">
                      {errors.clientName}
                    </div>
                  )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Nom du bateau</label>
                <input
                  type="text"
                  className={`form-control rounded-3 py-2 ${errors.boatName ? "is-invalid" : ""}`}
                  name="boatName"
                  value={formData.boatName}
                  onChange={handleChange}
                />
                {errors.boatName && (
                  <div className="invalid-feedback d-block">
                    {errors.boatName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Date de début</label>
                <input
                  type="date"
                  className={`form-control rounded-3 py-2 ${errors.startDate ? "is-invalid" : ""}`}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && (
                  <div className="invalid-feedback d-block">
                    {errors.startDate}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-2">Date de fin</label>
                <input
                  type="date"
                  className={`form-control rounded-3 py-2 ${errors.endDate ? "is-invalid" : ""}`}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && (
                  <div className="invalid-feedback d-block">
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;