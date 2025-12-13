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
  });

});
