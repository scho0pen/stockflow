require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 4000;

// Conectar a la BD y luego arrancar el servidor
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});