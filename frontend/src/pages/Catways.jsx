import { useEffect, useState } from "react";
import api from "../api";
import NavBar from "../composent/navBar";
import AddCatwayModal from "../composent/AddCatwayModal";
import DeleteCatwayModal from "../composent/DeleteCatwayModal";
import EditModal from "../composent/editCatwayModal";
import ViewCatwayModal from "../composent/viewCatwayModal";

function Catways() {
  const [catways, setCatways] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCatway, setSelectedCatway] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const fetchCatways = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await api.get("/catways", config);

      console.log("Catways :", res.data);
      setCatways(res.data.catways || res.data);
    } catch (err) {
      console.error(
        "Erreur récupération catways :",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");

    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erreur parsing user :", e);
      }
    }

    fetchCatways();
  }, []);

    const openDeleteModal = (catway) => {
    setSelectedCatway(catway);
    setShowDeleteModal(true);
  };

    const openEditModal = (catway) => {
    setSelectedCatway(catway);
    setShowEditModal(true);
  };

    const openViewModal = (catway) => {
    setSelectedCatway(catway);
    setShowViewModal(true);
  };

  const today = new Date().toLocaleDateString();

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <NavBar />

          <div className="col-10 p-4 bg-light min-vh-100">
            <h1 className="fw-bold mb-2">Catways</h1>
            <p className="text-muted mb-4">Gestion des catways du port</p>

            {/* CARD USER */}
            <div className="card mb-4 border-0 shadow-sm rounded-4">
              <div className="card-body">
                <h5 className="fw-bold">Utilisateur connecté</h5>
                <p className="mb-1">
                  <strong>Nom :</strong> {user?.username}
                </p>
                <p className="mb-1">
                  <strong>Email :</strong> {user?.email}
                </p>
                <p className="mb-0">
                  <strong>Date :</strong> {today}
                </p>
              </div>
            </div>

            {/* CARD CATWAYS */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">
                    Liste des catways ({Array.isArray(catways) ? catways.length : 0})
                  </h5>

                  <button
                    className="btn btn-primary rounded-3 px-4"
                    onClick={() => setShowAddModal(true)}
                  >
                    + Ajouter
                  </button>
                </div>

                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Numéro</th>
                      <th>Type</th>
                      <th>État</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(catways) && catways.length > 0 ? (
                      catways.map((catway, index) => (
                        <tr key={catway._id || index} style={{ cursor: "pointer" }} onClick={(e)=> {
                          e.stopPropagation(); openViewModal(catway);}}>
                          <td>
                            {catway.catwayNumber}</td>
                          <td>
                            <span className="badge text-bg-secondary">
                              {catway.catwayType}
                            </span>
                          </td>
                          <td>{catway.catwayState}</td>
                          <td>
                            <div className="d-flex gap-2">                            
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(catway);
                                }}
                              >
                                Modifier
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(catway);
                                }}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          Aucun catway trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCatwayModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCatwayAdded={fetchCatways}
      />

      <DeleteCatwayModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCatway(null);
        }}
        catway={selectedCatway}
        onDeleted={() => {
          fetchCatways();
          setShowDeleteModal(false);
          setSelectedCatway(null);
        }}
      />
      
      <EditModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCatway(null);
        }}
        catway={selectedCatway}
        onUpdated={() => {
          fetchCatways();
          setShowEditModal(false);
          setSelectedCatway(null);
        }}
      />

      <ViewCatwayModal
        show={showViewModal}
        handleClose={() => {
          setShowViewModal(false);
          setSelectedCatway(null);
        }}
        catway={selectedCatway}
      />
    </>
  );
}

export default Catways;