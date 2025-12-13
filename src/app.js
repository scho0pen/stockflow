require('dotenv').config();

const express = require('express');
const cors = require('cors');
// No necesitamos connectDB aquí adentro para la definición de la app, 
// pero si lo dejas importado no pasa nada, aunque es mejor quitarlo si no se usa.
// const connectDB = require('./config/db'); 
const reservationRoutes = require('./routes/reservationRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/reservations', reservationRoutes);

module.exports = app;