import { useEffect, useState } from "react";
import api from "../api";

function AddUserModal({ show, onClose, onSuccess }) {
  const initialForm = {
    username: "",
    email: "",
    password: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setForm(initialForm);
      setErrors({});
      setApiError("");
      setIsSubmitting(false);
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
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

    if (!form.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis.";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
    }

    if (!form.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    return newErrors;
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setForm(initialForm);
    setErrors({});
    setApiError("");
    onClose();
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      await api.post("/users", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setForm(initialForm);
      setErrors({});
      setApiError("");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);

      setApiError(
        error?.response?.data?.message ||
          "Impossible d'ajouter l'utilisateur."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div>
              <h4 className="modal-title fw-bold mb-1">Nouvel utilisateur</h4>
              <p className="text-muted mb-0 small">
                Ajoutez un nouvel utilisateur de la capitainerie
              </p>
            </div>

            <button
              className="btn-close"
              onClick={handleClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body px-4 pb-3">
            {apiError && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {apiError}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ex: capitaine.russell"
                className={`form-control rounded-3 py-2 ${
                  errors.username ? "is-invalid" : ""
                }`}
              />
              {errors.username && (
                <div className="invalid-feedback d-block">
                  {errors.username}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ex: nom@port-russell.com"
                className={`form-control rounded-3 py-2 ${
                  errors.email ? "is-invalid" : ""
                }`}
              />
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-1">
              <label className="form-label fw-semibold">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                className={`form-control rounded-3 py-2 ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center gap-2">
            <button
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;