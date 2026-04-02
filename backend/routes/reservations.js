const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const reservationsController = require("../controllers/reservationsController");

// GET toutes les réservations
router.get("/", protect, reservationsController.getAllReservations);

module.exports = router;