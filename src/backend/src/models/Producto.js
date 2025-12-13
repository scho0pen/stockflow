// models/Producto.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
  nombre:       { type: String, required: true },
  descripcion:  { type: String, required: true },
  categoria:    { type: String, required: true },
  precio:       { type: Number, required: true },
  stock:        { type: Number, default: 0 }
});

// Exportamos el modelo de Producto basado en el esquema
module.exports = mongoose.model('Producto', ProductoSchema);
