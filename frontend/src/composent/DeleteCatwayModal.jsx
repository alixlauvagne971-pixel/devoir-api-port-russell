import { useState } from "react";
import api from "../api";

function DeleteCatwayModal({ show, onClose, catway, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show || !catway) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      await api.delete(`/catways/${catway.catwayNumber}`, config);

      if (onDeleted) {
        onDeleted();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de la suppression du catway."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow rounded-4">
            <div className="modal-header bg-danger-subtle text-danger border-0 rounded-top-4 px-4 py-3">
              <h5 className="modal-title">Supprimer un catway</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            <div className="modal-body px-4 py-4">
              <p className="mb-2">
                Es-tu sûr de vouloir supprimer ce catway ?
              </p>

              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1">
                  <strong>Numéro :</strong> {catway.catwayNumber}
                </p>
                <p className="mb-1">
                  <strong>Type :</strong> {catway.catwayType}
                </p>
                <p className="mb-0">
                  <strong>État :</strong> {catway.catwayState}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="alert alert-danger rounded-4 py-2 mb-0 mx-3" role="alert">
                Cette action est définitive.
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteCatwayModal;