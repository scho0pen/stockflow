const express = require('express');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// Define API endpoints for reservation management
router.post('/', reservationController.create.bind(reservationController));
router.get('/', reservationController.list.bind(reservationController));
router.get('/:id', reservationController.getById.bind(reservationController));
router.put('/:id', reservationController.update.bind(reservationController));
router.delete('/:id', reservationController.delete.bind(reservationController));

module.exports = router;