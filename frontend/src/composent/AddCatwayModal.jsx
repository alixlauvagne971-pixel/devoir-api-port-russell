import { useState } from "react";
import api from "../api";

function AddCatwayModal({ show, onClose, onCatwayAdded }) {
  const [formData, setFormData] = useState({
    catwayNumber: "",
    catwayType: "short",
    catwayState: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      catwayNumber: "",
      catwayType: "short",
      catwayState: "",
    });
    setError("");
    setLoading(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.catwayNumber || !formData.catwayState.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      await api.post(
        "/catways",
        {
          catwayNumber: Number(formData.catwayNumber),
          catwayType: formData.catwayType,
          catwayState: formData.catwayState,
        },
        config
      );

      resetForm();
      onClose();

      if (onCatwayAdded) {
        onCatwayAdded();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'ajout du catway.";

        setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Ajouter un catway</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body pt-3">
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Numéro</label>
                  <input
                    type="number"
                    name="catwayNumber"
                    className="form-control"
                    value={formData.catwayNumber}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Type</label>
                  <select
                    name="catwayType"
                    className="form-select"
                    value={formData.catwayType}
                    onChange={handleChange}
                  >
                    <option value="short">short</option>
                    <option value="long">long</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">État</label>
                  <textarea
                    name="catwayState"
                    className="form-control"
                    rows="3"
                    value={formData.catwayState}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Ajout..." : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default AddCatwayModal;