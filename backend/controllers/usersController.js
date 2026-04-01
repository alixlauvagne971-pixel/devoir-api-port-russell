const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

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