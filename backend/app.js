const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catwaysRoutes = require('./routes/catways');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
  })
);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Port Russell fonctionne',
  });
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwaysRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable',
  });
});

module.exports = app;