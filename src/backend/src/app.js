require('dotenv').config(); // Add this at the top of app.js if not already present

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
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

// Connect to DB and start server only if this module is run directly
if (require.main === module) {
  const port = process.env.PORT || 4000;
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;