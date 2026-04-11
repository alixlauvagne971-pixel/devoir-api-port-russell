import { useEffect, useState } from "react";
import NavBar from "../composent/navBar";
import api from "../api";
import AddUserModal from "../composent/addUserModal";
import EditUserModal from "../composent/editUserModal";

function Users() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setToday(currentDate);

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
      setError("Impossible de charger les utilisateurs.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

    const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
    };

  return (
    <>
        <div className="container-fluid p-0">
        <div className="row g-0">
            <NavBar />

            <div className="col-10 p-4 bg-light min-vh-100">
            <h1 className="fw-bold mb-2">Utilisateurs</h1>
            <p className="text-muted mb-4">
                Gestion des utilisateurs du port
            </p>

            {/* CARD USER */}
            <div className="card mb-4 border-0 shadow-sm rounded-4">
                <div className="card-body">
                <h5 className="fw-bold">Utilisateur connecté</h5>
                <p className="mb-1">
                    <strong>Nom :</strong> {user?.username || "Non renseigné"}
                </p>
                <p className="mb-1">
                    <strong>Email :</strong> {user?.email || "Non renseigné"}
                </p>
                <p className="mb-0">
                    <strong>Date :</strong> {today}
                </p>
                </div>
            </div>

            {/* CARD USERS */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                    Liste des utilisateurs ({Array.isArray(users) ? users.length : 0})
                    </h5>

                    <button
                        className="btn btn-primary rounded-3 px-4"
                        onClick={() => setShowAddModal(true)}
                        >
                        + Ajouter
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                    {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-muted mb-0">Chargement des utilisateurs...</p>
                ) : users.length === 0 ? (
                    <p className="text-muted mb-0">Aucun utilisateur trouvé.</p>
                ) : (
                    <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u, index) => (
                        <tr key={u.email || index}>
                            <td style={{ cursor: "pointer" }}>{u.username}</td>
                            <td style={{ cursor: "pointer" }}>{u.email}</td>

                            <td className="action-cell">
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => openEditModal(u)}
                                    >
                                    Modifier
                                </button>

                                <button
                                className="btn btn-sm btn-outline-danger"
                                >
                                Supprimer
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>

        <AddUserModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchUsers}
        />

        <EditUserModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={selectedUser}
            onSuccess={fetchUsers}
        />
    </>
  );
}


export default Users;