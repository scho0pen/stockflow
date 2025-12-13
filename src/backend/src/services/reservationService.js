const Reservation = require('../models/reservationModel');

/**
 * Service layer for reservation operations. It abstracts direct model calls
 * providing a clear API for controllers and encapsulates business logic.
 */
class ReservationService {
  /**
   * Create a new reservation in the database.
   * @param {Object} data Reservation data object
   * @returns {Promise<Reservation>} Created reservation document
   */
  async createReservation(data) {
    const reservation = new Reservation(data);
    return await reservation.save();
  }

  /**
   * Retrieve all reservations from the database.
   * @returns {Promise<Reservation[]>} Array of reservation documents
   */
  async getAllReservations() {
    return await Reservation.find().sort({ createdAt: -1 });
  }

  /**
   * Retrieve a single reservation by its ID.
   * @param {String} id Reservation id
   * @returns {Promise<Reservation|null>} Reservation document or null if not found
   */
  async getReservationById(id) {
    return await Reservation.findById(id);
  }

  /**
   * Update a reservation by its ID.
   * @param {String} id Reservation id
   * @param {Object} data Data to update
   * @returns {Promise<Reservation|null>} Updated reservation or null if not found
   */
  async updateReservation(id, data) {
    return await Reservation.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete a reservation by its ID.
   * @param {String} id Reservation id
   * @returns {Promise<Reservation|null>} Deleted reservation or null if not found
   */
  async deleteReservation(id) {
    return await Reservation.findByIdAndDelete(id);
  }
}

module.exports = new ReservationService();