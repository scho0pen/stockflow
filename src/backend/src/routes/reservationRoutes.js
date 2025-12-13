const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// 1. Estadísticas
router.get('/stats', reservationController.getDashboardStats);

// 2. Rutas Generales
router.post('/', reservationController.create);
router.get('/', reservationController.list);

// 3. Rutas con ID
router.get('/:id', reservationController.getById);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.delete);

module.exports = router;
