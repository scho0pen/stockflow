const reservationController = require('../../src/controllers/reservationController');
const Reservation = require('../../src/models/reservationModel');
const httpMocks = require('node-mocks-http');

// MOCK del Modelo de Mongoose
jest.mock('../../src/models/reservationModel');

let req, res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  jest.clearAllMocks(); // Limpiar mocks antes de cada test
});

describe('Reservation Controller - Unit Tests', () => {

  // --- CREATE ---
  describe('create', () => {
    it('Debe crear una reserva exitosamente (201)', async () => {
      // Datos completos para pasar validación
      const mockData = { 
        productName: 'Laptop', 
        user: 'Juan', 
        price: 1500, 
        description: 'Test',
        quantity: 1,
        status: 'Activa'
      };
      
      req.body = mockData;

      // Simulamos el comportamiento de .save()
      Reservation.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockData)
      }));

      await reservationController.create(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
    });

    it('Debe retornar 400 si ocurre un error al crear', async () => {
      req.body = { invalid: 'data' };
      const errorMessage = 'Error de validación';

      Reservation.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error(errorMessage))
      }));

      await reservationController.create(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe(errorMessage);
    });
  });

  // --- LIST ---
  describe('list', () => {
    it('Debe listar todas las reservas (200)', async () => {
      const mockList = [{ productName: 'A' }, { productName: 'B' }];
      Reservation.find.mockResolvedValue(mockList);

      await reservationController.list(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockList);
    });

    it('Debe retornar 500 si falla la base de datos', async () => {
      // Forzamos el error en el mock
      Reservation.find.mockRejectedValue(new Error('Conexión perdida'));

      await reservationController.list(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('message', 'Conexión perdida'); // (Línea 22 cubierta)
    });
  });

  // --- GET BY ID ---
  describe('getById', () => {
    it('Debe retornar una reserva si existe (200)', async () => {
      const mockReservation = { productName: 'Laptop', _id: '123' };
      Reservation.findById.mockResolvedValue(mockReservation);
      req.params.id = '123';

      await reservationController.getById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockReservation);
    });

    it('Debe retornar 404 si la reserva no existe', async () => {
      Reservation.findById.mockResolvedValue(null);
      req.params.id = 'nonexistent';

      await reservationController.getById(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('Debe retornar 500 si hay un error interno', async () => {
      req.params.id = '123';
      Reservation.findById.mockRejectedValue(new Error('Error crítico'));

      await reservationController.getById(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('message', 'Error crítico'); // (Línea 35 cubierta)
    });
  });

  // --- UPDATE ---
  describe('update', () => {
    it('Debe actualizar una reserva existente (200)', async () => {
      const updatedData = { productName: 'Laptop Updated' };
      req.params.id = '123';
      req.body = updatedData;

      Reservation.findByIdAndUpdate.mockResolvedValue(updatedData);

      await reservationController.update(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(updatedData);
    });

    it('Debe retornar 404 si intenta actualizar algo inexistente', async () => {
      Reservation.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = 'no-id';

      await reservationController.update(req, res);

      expect(res.statusCode).toBe(404);
    });
  });

  // --- DELETE ---
  describe('delete', () => {
    it('Debe eliminar una reserva existente (204)', async () => {
      req.params.id = '123';
      // Simulamos que encuentra y borra algo
      Reservation.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      await reservationController.delete(req, res);

      expect(res.statusCode).toBe(204);
    });

    it('Debe retornar 404 si intenta eliminar algo inexistente', async () => {
      req.params.id = 'no-id';
      Reservation.findByIdAndDelete.mockResolvedValue(null);

      await reservationController.delete(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('Debe retornar 500 si falla la eliminación', async () => {
      req.params.id = '123';
      Reservation.findByIdAndDelete.mockRejectedValue(new Error('Error al borrar'));

      await reservationController.delete(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('message', 'Error al borrar'); // (Línea 67 cubierta)
    });
  });

  // --- DASHBOARD STATS ---  //
  describe('getDashboardStats', () => {
    it('Debe retornar las estadísticas correctamente (200)', async () => {
      // Preparamos los datos falsos que devolvería MongoDB
      const mockSales = [{ totalSales: 10000, totalItems: 5 }];
      const mockTopProds = [{ _id: 'Laptop', count: 2, totalRevenue: 5000 }];
      const mockStatus = [{ _id: 'Activa', count: 3 }, { _id: 'Cancelada', count: 1 }];

      // Como tu controlador llama a .aggregate() 3 veces, usamos mockResolvedValueOnce 3 veces
      Reservation.aggregate = jest.fn()
        .mockResolvedValueOnce(mockSales)      // 1ª llamada: Ventas
        .mockResolvedValueOnce(mockTopProds)   // 2ª llamada: Top Productos
        .mockResolvedValueOnce(mockStatus);    // 3ª llamada: Estados

      await reservationController.getDashboardStats(req, res);

      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      
      // Verificaciones
      expect(data.totalSales).toBe(10000);
      expect(data.topProducts[0].name).toBe('Laptop');
      expect(data.statusBreakdown).toHaveLength(2);
    });

    it('Debe manejar arrays vacíos si no hay reservas (200)', async () => {
      // Si la DB está vacía, aggregate devuelve arrays vacíos
      Reservation.aggregate = jest.fn()
        .mockResolvedValueOnce([]) 
        .mockResolvedValueOnce([]) 
        .mockResolvedValueOnce([]);

      await reservationController.getDashboardStats(req, res);

      const data = res._getJSONData();
      expect(data.totalSales).toBe(0); // Debe manejar el 0 por defecto
      expect(data.topProducts).toEqual([]);
    });

    it('Debe retornar 500 si falla la base de datos', async () => {
      Reservation.aggregate = jest.fn().mockRejectedValue(new Error('Error de conexión'));

      await reservationController.getDashboardStats(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toHaveProperty('message', 'Error al calcular estadísticas');
    });
  });

});
