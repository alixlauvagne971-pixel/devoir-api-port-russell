import { Modal, Button, Badge } from "react-bootstrap";

function ReservDetailModal({ show, onHide, reservation }) {
  if (!reservation) return null;

  const today = new Date();
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);

  const isActive = today >= startDate && today <= endDate;
  const isFinished = today > endDate;

  let statusText = "À venir";
  let statusVariant = "warning";

  if (isActive) {
    statusText = "En cours";
    statusVariant = "success";
  } else if (isFinished) {
    statusText = "Terminée";
    statusVariant = "secondary";
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdropClassName="backdrop-blur"
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark">
          Détail de la réservation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-muted">Réservation du port</h6>
          <Badge bg={statusVariant} pill>
            {statusText}
          </Badge>
        </div>

        <div className="bg-light rounded-4 p-4 mb-3 shadow-sm border">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <small className="text-uppercase text-secondary fw-semibold small">Catway</small>
              <div className="fw-bold fs-6 text-dark">{reservation.catwayNumber}</div>
            </div>

            <div className="col-12 col-md-6">
              <small className="text-uppercase text-secondary fw-semibold small">Client</small>
              <div className="fw-bold fs-6 text-dark">{reservation.clientName}</div>
            </div>

            <div className="col-12 col-md-6">
              <small className="text-uppercase text-secondary fw-semibold small">Bateau</small>
              <div className="fw-bold fs-6 text-dark">{reservation.boatName}</div>
            </div>

            <div className="col-12 col-md-6">
              <small className="text-uppercase text-secondary fw-semibold small">Début</small>
              <div className="fw-bold fs-6 text-dark">
                {startDate.toLocaleDateString()}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <small className="text-uppercase text-secondary fw-semibold small">Fin</small>
              <div className="fw-bold fs-6 text-dark">
                {endDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ReservDetailModal;