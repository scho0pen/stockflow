const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// --- RUTAS ESTÁTICAS (Deben ir primero) ---

// Obtener estadísticas para el Dashboard
router.get('/stats', reservationController.getDashboardStats);


// --- RUTAS GENERALES ---

// Crear una nueva reserva
router.post('/', reservationController.create);

// Listar todas las reservas
router.get('/', reservationController.list);


// --- RUTAS DINÁMICAS (Con parámetros ID, deben ir al final) ---

// Obtener una reserva específica por ID
router.get('/:id', reservationController.getById);

// Eliminar una reserva por ID
router.delete('/:id', reservationController.delete);

module.exports = router;
