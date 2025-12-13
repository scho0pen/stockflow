const Reservation = require('../models/reservationModel');

// 1. Crear Reserva
exports.create = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    console.error(error);
    // Nota: Estandarizamos el error a 'message' para facilitar los tests
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
};

// 2. Listar Reservas
exports.list = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// 4. Actualizar Reserva (LA QUE FALTABA)
exports.update = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: devuelve el dato actualizado
    );
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Eliminar Reserva
exports.delete = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Estadísticas del Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
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

    const statusStats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

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
