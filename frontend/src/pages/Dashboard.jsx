function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-5">
      <h1>Tableau de bord</h1>
      <p>Bienvenue {user?.username || "utilisateur"} !</p>
      <p>Email : {user?.email || "non disponible"}</p>
    </div>
  );
}

export default Dashboard;