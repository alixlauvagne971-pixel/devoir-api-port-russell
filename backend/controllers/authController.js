const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe obligatoires'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    req.session.user = {
      email: user.email,
      username: user.username
    };

    res.status(200).json({
      message: 'Connexion réussie',
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: 'Erreur lors de la déconnexion'
      });
    }

    res.clearCookie('connect.sid');
    res.status(200).json({
      message: 'Déconnexion réussie'
    });
  });
};