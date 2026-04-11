import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../api";

function ViewUserModal({ show, onClose, user }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!show || !user?.email) return;

      try {
        setLoading(true);
        setError("");
        setUserDetails(null);

        const response = await api.get(`/users/${encodeURIComponent(user.email)}`);
        setUserDetails(response.data.user);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setError("Impossible de récupérer les détails de cet utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [show, user]);

  const handleClose = () => {
    setError("");
    setUserDetails(null);
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName="rounded-4"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark">
          Détails de l'utilisateur
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {loading ? (
          <p className="text-muted mb-0">Chargement des détails...</p>
        ) : error ? (
          <div className="alert alert-danger rounded-4 mb-0">
            {error}
          </div>
        ) : userDetails ? (
          <div className="bg-light border rounded-4 p-3 shadow-sm">
            <div className="mb-3">
              <span className="fw-semibold text-dark">Nom d'utilisateur :</span>{" "}
              <span className="text-secondary">
                {userDetails.username || "Non renseigné"}
              </span>
            </div>

            <div className="mb-0">
              <span className="fw-semibold text-dark">Email :</span>{" "}
              <span className="text-secondary">
                {userDetails.email || "Non renseigné"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted mb-0">Aucune donnée disponible.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={handleClose}
          className="rounded-3 px-4 fw-semibold"
        >
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewUserModal;