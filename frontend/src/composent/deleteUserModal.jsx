import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../api";

function DeleteUserModal({ show, onClose, user, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (!user) return null;

  const handleClose = () => {
    setDeleteError("");
    onClose();
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await api.delete(`/users/${encodeURIComponent(user.email)}`);

      handleClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur :", err);
      setDeleteError("Impossible de supprimer cet utilisateur.");
    } finally {
      setIsDeleting(false);
    }
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
          Supprimer l'utilisateur
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <p className="text-muted mb-3">
          Tu es sur le point de supprimer cet utilisateur :
        </p>

        <div className="bg-light border rounded-4 p-3 mb-3 shadow-sm">
          <div className="mb-2">
            <span className="fw-semibold text-dark">Nom :</span>{" "}
            <span className="text-secondary">{user.username}</span>
          </div>

          <div className="mb-0">
            <span className="fw-semibold text-dark">Email :</span>{" "}
            <span className="text-secondary">{user.email}</span>
          </div>
        </div>

        <div className="alert alert-danger rounded-4 py-2 mb-3">
          Cette action est définitive.
        </div>

        {deleteError && (
          <div className="alert alert-danger rounded-4 py-2 mb-0">
            {deleteError}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex justify-content-center gap-2">
        <Button
          variant="light"
          onClick={handleClose}
          disabled={isDeleting}
          className="rounded-3 px-4 fw-semibold"
        >
          Annuler
        </Button>

        <Button
          variant="danger"
          onClick={handleDeleteUser}
          disabled={isDeleting}
          className="rounded-3 px-4 fw-semibold shadow-sm"
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteUserModal;