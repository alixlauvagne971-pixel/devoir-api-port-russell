const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const catwaysController = require('../controllers/catwaysController');
const reservationsController = require('../controllers/reservationsController');

// Catways
router.get('/', protect, catwaysController.getAllCatways);
router.get('/:id', protect, catwaysController.getCatwayById);
router.post('/', protect, catwaysController.createCatway);
router.put('/:id', protect, catwaysController.updateCatway);
router.delete('/:id', protect, catwaysController.deleteCatway);

// Réservations liées aux catways
router.get('/:id/reservations', protect, reservationsController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', protect, reservationsController.getReservationById);
router.post('/:id/reservations', protect, reservationsController.createReservation);
router.put('/:id/reservations/:idReservation', protect, reservationsController.updateReservation);
router.delete('/:id/reservations/:idReservation', protect, reservationsController.deleteReservation);

module.exports = router;