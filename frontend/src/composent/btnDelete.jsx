import { useState } from "react";
import api from "../api";
import { Modal, Button } from "react-bootstrap";
import trashIcon from "../assets/img/icones/trash3-fill.svg";


function DeleteReservationButton({ reservation, onDeleteSuccess }) {
  const [deleteError, setDeleteError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteReservation = async () => {
  try {
    setIsDeleting(true);

    const token = localStorage.getItem("token");

    await api.delete(
      `/catways/${reservation.catwayNumber}/reservations/${reservation._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onDeleteSuccess(reservation._id);
    setShowModal(false);
  } catch (error) {
  console.error("Erreur suppression réservation :", error);

  const status = error?.response?.status;
  const messageBackend = error?.response?.data?.message;

  if (status === 404) {
    setDeleteError(messageBackend || "Réservation introuvable.");
  } else if (status === 401) {
    setDeleteError("Session expirée ou accès non autorisé.");
  } else if (status === 500) {
    setDeleteError("Erreur serveur lors de la suppression.");
  } else {
    setDeleteError(messageBackend || "Impossible de supprimer la réservation.");
    }
  }
};

  return (
    <>
      <img
          src={trashIcon}
          alt="Supprimer"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteError("");
            setShowModal(true);
          }}
      />

      <Modal show={showModal} onHide={(e) => {
        if (e?.stopPropagation) e.stopPropagation();
        setDeleteError("");
        setShowModal(false);
      }} centered backdrop="static"dialogClassName="rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-3 text-dark">
                Supprimer la réservation
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
        <p className="text-muted mb-3">
            Tu es sur le point de supprimer cette réservation :
        </p>

        <div className="bg-light border rounded-4 p-3 mb-3 shadow-sm">
            <div className="mb-2">
            <span className="fw-semibold text-dark">Client :</span>{" "}
            <span className="text-secondary">{reservation.clientName}</span>
            </div>

            <div className="mb-2">
            <span className="fw-semibold text-dark">Bateau :</span>{" "}
            <span className="text-secondary">{reservation.boatName}</span>
            </div>

            <div className="mb-0">
            <span className="fw-semibold text-dark">Catway :</span>{" "}
            <span className="text-secondary">{reservation.catwayNumber}</span>
            </div>
        </div>

        <div className="alert alert-danger rounded-4 py-2 mb-0">
            Cette action est définitive.
        </div>

        {deleteError && (
          <div className="alert alert-danger rounded-4 py-2 mb-3">
            {deleteError}
          </div>
        )}
        
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 d-flex justify-content-center">
          <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReservation();
                  }}
                  disabled={isDeleting}
                  className="rounded-3 px-4 fw-semibold shadow-sm d-flex justify-content-center"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteReservationButton;