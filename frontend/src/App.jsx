import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Reservations from "./pages/Reservations";
import Catways from "./pages/Catways";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/catways" element={<Catways />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;