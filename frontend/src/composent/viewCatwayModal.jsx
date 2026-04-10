import { useEffect, useState } from "react";
import { Modal, Button, Badge, Spinner, Alert } from "react-bootstrap";
import api from "../api";

function ViewCatwayModal({ show, handleClose, catway }) {
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [errorReservations, setErrorReservations] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      if (!show || !catway) return;

      setLoadingReservations(true);
      setErrorReservations("");

      try {
        const token = localStorage.getItem("token");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const res = await api.get(
          `/catways/${catway.catwayNumber}/reservations`,
          config
        );

        setReservations(res.data.reservations || res.data || []);
      } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Erreur inconnue";

            setErrorReservations(message);
            setReservations([]);
            } finally {
                setLoadingReservations(false);
            }
    };

    fetchReservations();
  }, [show, catway]);

  if (!catway) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="modal-blur"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
        Détails du catway
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <div className="mb-3">
          <small className="text-muted">Numéro</small>
          <div className="fw-semibold">{catway.catwayNumber}</div>
        </div>

        <div className="mb-3">
          <small className="text-muted">Type</small>
          <div>
            <Badge bg="secondary">{catway.catwayType}</Badge>
          </div>
        </div>

        <div className="mb-4">
          <small className="text-muted">État</small>
          <div className="fw-semibold">{catway.catwayState}</div>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 fw-bold">Réservations liées</h6>
          <Badge bg="light" text="dark">
            {reservations.length}
          </Badge>
        </div>

        {loadingReservations && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" className="me-2" />
            <span className="text-muted">Chargement des réservations...</span>
          </div>
        )}

        {errorReservations && (
          <Alert variant="danger" className="py-2">
            {errorReservations}
          </Alert>
        )}

        {!loadingReservations && !errorReservations && reservations.length === 0 && (
          <div className="text-muted small">
            Aucune réservation pour ce catway.
          </div>
        )}

        {!loadingReservations && !errorReservations && reservations.length > 0 && (
          <div className="d-flex flex-column gap-3">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="border rounded-3 p-3 bg-light"
              >
                <div className="fw-semibold">{reservation.clientName}</div>
                <div className="text-muted small mb-2">
                  Bateau : {reservation.boatName}
                </div>

                <div className="small">
                  <div>
                    <strong>Début :</strong>{" "}
                    {new Date(reservation.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Fin :</strong>{" "}
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          className="px-4"
          onClick={handleClose}
        >
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewCatwayModal;