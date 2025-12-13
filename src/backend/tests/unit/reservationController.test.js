const ReservationController = require('../../src/controllers/reservationController');

describe('ReservationController', () => {
  let mockService;
  let controller;

  beforeEach(() => {
    // Create a mock service object
    mockService = {
      createReservation: jest.fn(),
      getAllReservations: jest.fn(),
      getReservationById: jest.fn(),
      updateReservation: jest.fn(),
      deleteReservation: jest.fn(),
    };
    // Inject the mock into controller
    controller = new ReservationController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return 201 and created reservation', async () => {
      const req = { body: { user: 'test', productName: 'Item', description: 'Desc', price: 100, quantity: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReservation = { id: '1', ...req.body };
      
      mockService.createReservation.mockResolvedValue(mockReservation);
      
      await controller.create(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockReservation);
    });

    it('should return 400 on error', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      mockService.createReservation.mockRejectedValue(new Error('Invalid'));
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
  });

  describe('list', () => {
    it('should return reservations list', async () => {
      const req = {};
      const res = { json: jest.fn() };
      const data = [{ id: '1' }, { id: '2' }];
      mockService.getAllReservations.mockResolvedValue(data);
      await controller.list(req, res);
      expect(res.json).toHaveBeenCalledWith(data);
    });
  });

  describe('getById', () => {
    it('should return a reservation', async () => {
      const req = { params: { id: '1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const reservation = { id: '1' };
      mockService.getReservationById.mockResolvedValue(reservation);
      await controller.getById(req, res);
      expect(res.json).toHaveBeenCalledWith(reservation);
    });

    it('should return 404 when not found', async () => {
      const req = { params: { id: '1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      mockService.getReservationById.mockResolvedValue(null);
      await controller.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('update', () => {
    it('should update reservation', async () => {
      const req = { params: { id: '1' }, body: { status: 'Confirmada' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const updated = { id: '1', status: 'Confirmada' };
      mockService.updateReservation.mockResolvedValue(updated);
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 when update fails', async () => {
      const req = { params: { id: '1' }, body: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      mockService.updateReservation.mockResolvedValue(null);
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('should delete reservation', async () => {
      const req = { params: { id: '1' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      mockService.deleteReservation.mockResolvedValue({ id: '1' });
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 when deletion fails', async () => {
      const req = { params: { id: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      mockService.deleteReservation.mockResolvedValue(null);
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});