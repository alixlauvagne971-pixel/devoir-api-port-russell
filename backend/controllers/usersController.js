const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email et password sont requis',
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email existe déjà',
      });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l’utilisateur',
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message,
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l’utilisateur',
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const currentEmail = req.params.email.toLowerCase().trim();
    const { username, email, password } = req.body;

    const user = await User.findOne({ email: currentEmail }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    if (email && email.toLowerCase().trim() !== currentEmail) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Le nouvel email est déjà utilisé',
        });
      }

      user.email = email.toLowerCase().trim();
    }

    if (username) {
      user.username = username;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l’utilisateur',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l’utilisateur',
      error: error.message,
    });
  }
};