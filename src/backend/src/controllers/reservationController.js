const reservationService = require('../services/reservationService');

/**
 * Controller layer for reservation endpoints. It receives HTTP requests and
 * returns responses, delegating business logic to the service layer.
 */
class ReservationController {
  /**
   * Create a new reservation.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    try {
      const reservation = await reservationService.createReservation(req.body);
      return res.status(201).json(reservation);
    } catch (error) {
      console.error('Error creating reservation', error);
      return res.status(400).json({ message: 'Error creating reservation', error: error.message });
    }
  }

  /**
   * Get all reservations.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async list(req, res) {
    try {
      const reservations = await reservationService.getAllReservations();
      return res.json(reservations);
    } catch (error) {
      console.error('Error fetching reservations', error);
      return res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
  }

  /**
   * Get a single reservation by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.getReservationById(id);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      return res.json(reservation);
    } catch (error) {
      console.error('Error fetching reservation', error);
      return res.status(500).json({ message: 'Error fetching reservation', error: error.message });
    }
  }

  /**
   * Update a reservation by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await reservationService.updateReservation(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      return res.json(updated);
    } catch (error) {
      console.error('Error updating reservation', error);
      return res.status(400).json({ message: 'Error updating reservation', error: error.message });
    }
  }

  /**
   * Delete a reservation by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await reservationService.deleteReservation(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting reservation', error);
      return res.status(500).json({ message: 'Error deleting reservation', error: error.message });
    }
  }
}

module.exports = new ReservationController();