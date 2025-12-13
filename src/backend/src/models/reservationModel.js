const { Schema, model } = require('mongoose');

/**
 * Reservation schema defines the structure for reservation documents stored
 * in MongoDB. It includes references to the adviser or customer as user,
 * product information, quantity, price, status and timestamps.
 */
const reservationSchema = new Schema(
  {
    user: {type: String,required: true,},
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Activa','Cancelada'],
      default: 'Activa',
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;