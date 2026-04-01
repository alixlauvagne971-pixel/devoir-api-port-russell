const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

exports.getReservationsByCatway = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway introuvable',
      });
    }

    const reservations = await Reservation.find({ catwayNumber }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber,
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable',
      });
    }

    res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;

    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'clientName, boatName, startDate et endDate sont requis',
      });
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway introuvable',
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début',
      });
    }

    const newReservation = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: 'Réservation créée',
      reservation: newReservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur création réservation',
      error: error.message,
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;

    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'clientName, boatName, startDate et endDate sont requis',
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début',
      });
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      {
        _id: req.params.idReservation,
        catwayNumber,
      },
      {
        clientName,
        boatName,
        startDate,
        endDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation mise à jour',
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur mise à jour réservation',
      error: error.message,
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    const deletedReservation = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber,
    });

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur suppression réservation',
      error: error.message,
    });
  }
};