import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import api from "../api";

function EditModal({ show, onClose, catway, onUpdated }) {
  const [catwayState, setCatwayState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (catway) {
      setCatwayState(catway.catwayState || "");
      setError("");
    }
  }, [catway, show]);

  const handleClose = () => {
    setCatwayState("");
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!catwayState.trim()) {
      setError("L’état du catway est obligatoire.");
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

      await api.put(
        `/catways/${catway.catwayNumber}`,
        { catwayState },
        config
      );

      onUpdated();
      handleClose();
    } catch (err) {
        const message =
            err.response?.data?.message ||
            err.response?.data ||
            err.message ||
            "Erreur inconnue";

        setError(message);
        } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Modifier le catway</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {catway && (
          <div className="mb-3 p-3 bg-light rounded-3 border">
            <p className="mb-1">
              <strong>Numéro :</strong> {catway.catwayNumber}
            </p>
            <p className="mb-0">
              <strong>Type :</strong> {catway.catwayType}
            </p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">État du catway</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={catwayState}
              onChange={(e) => setCatwayState(e.target.value)}
              placeholder="Saisir le nouvel état du catway"
            />
            <Form.Text className="text-muted">
              Seul l’état du catway peut être modifié.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="light"
              onClick={handleClose}
              disabled={loading}
              className="border"
            >
              Annuler
            </Button>
            <Button variant="warning" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditModal;