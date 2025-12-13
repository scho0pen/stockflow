const Reservation = require('../models/reservationModel');

// 1. Crear Reserva
exports.create = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// 2. Listar Reservas
exports.list = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Obtener Reserva por ID
exports.getById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Eliminar Reserva
exports.delete = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Estadísticas del Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // A. Ventas Totales (Solo Activas)
    const salesStats = await Reservation.aggregate([
      { $match: { status: 'Activa' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$price' },
          totalItems: { $sum: '$quantity' }
        }
      }
    ]);

    // B. Top Productos
    const topProducts = await Reservation.aggregate([
      { $match: { status: 'Activa' } },
      {
        $group: {
          _id: '$productName',
          count: { $sum: '$quantity' },
          totalRevenue: { $sum: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // C. Estado de Reservas
    const statusStats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Armar respuesta segura
    const stats = {
      totalSales: salesStats[0]?.totalSales || 0,
      reservedItems: salesStats[0]?.totalItems || 0,
      topProducts: topProducts.map(p => ({
        name: p._id || 'Desconocido',
        quantity: p.count,
        revenue: p.totalRevenue
      })),
      statusBreakdown: statusStats.map(s => ({
        status: s._id || 'Sin estado',
        count: s.count
      }))
    };

    res.json(stats);

  } catch (error) {
    console.error('Error en dashboard stats:', error);
    res.status(500).json({ message: 'Error al calcular estadísticas' });
  }
};
