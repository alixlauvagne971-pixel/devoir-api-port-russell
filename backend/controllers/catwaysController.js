const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });

    res.status(200).json({
      success: true,
      count: catways.length,
      catways,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Catway introuvable',
      });
    }

    res.status(200).json({
      success: true,
      catway,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};

exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (catwayNumber === undefined || !catwayType || !catwayState) {
      return res.status(400).json({
        success: false,
        message: 'catwayNumber, catwayType et catwayState sont requis',
      });
    }

    const existingCatway = await Catway.findOne({ catwayNumber });

    if (existingCatway) {
      return res.status(409).json({
        success: false,
        message: 'Ce numéro de catway existe déjà',
      });
    }

    const newCatway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState,
    });

    res.status(201).json({
      success: true,
      message: 'Catway créé',
      catway: newCatway,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur création catway',
      error: error.message,
    });
  }
};

exports.updateCatway = async (req, res) => {
  try {
    const { catwayState } = req.body;

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: Number(req.params.id) },
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!updatedCatway) {
      return res.status(404).json({
        success: false,
        message: 'Catway introuvable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Catway mis à jour',
      catway: updatedCatway,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur mise à jour',
      error: error.message,
    });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    const deletedCatway = await Catway.findOneAndDelete({
      catwayNumber: Number(req.params.id),
    });

    if (!deletedCatway) {
      return res.status(404).json({
        success: false,
        message: 'Catway introuvable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Catway supprimé',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur suppression',
      error: error.message,
    });
  }
};