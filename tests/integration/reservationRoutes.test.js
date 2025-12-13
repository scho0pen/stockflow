const request = require('supertest');

// 1. MOVER EL MOCK AL PRINCIPIO y usar un "Factory"
// Esto fuerza a que cualquiera que importe el servicio reciba este objeto simple
// en lugar de la instancia real que intenta conectarse a Mongo.
jest.mock('../../src/services/reservationService', () => ({
  getAllReservations: jest.fn(),
  createReservation: jest.fn(),
  getReservationById: jest.fn(),
  updateReservation: jest.fn(),
  deleteReservation: jest.fn(),
}));

// 2. Importar la app y el servicio (que ahora será el mock definido arriba)
const app = require('../../src/app');
const reservationService = require('../../src/services/reservationService');

describe('Reservation Routes Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los contadores de llamadas
  });

  test('GET /api/reservations returns list', async () => {
    const data = [{ id: '1', item: 'Laptop' }, { id: '2', item: 'Proyector' }];
    // Configuramos qué debe responder el mock
    reservationService.getAllReservations.mockResolvedValue(data);

    const res = await request(app).get('/api/reservations');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    // Verificamos que se llamó a la función simulada
    expect(reservationService.getAllReservations).toHaveBeenCalled();
  });

  test('POST /api/reservations creates reservation', async () => {
    const body = { user: 'test', productName: 'Item', description: 'Desc', price: 100 };
    const saved = { id: '1', ...body };
    reservationService.createReservation.mockResolvedValue(saved);

    const res = await request(app).post('/api/reservations').send(body);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(saved);
  });

  test('PUT /api/reservations/:id updates reservation', async () => {
    const updated = { id: '1', status: 'Confirmada' };
    reservationService.updateReservation.mockResolvedValue(updated);

    const res = await request(app).put('/api/reservations/1').send({ status: 'Confirmada' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  test('DELETE /api/reservations/:id deletes reservation', async () => {
    reservationService.deleteReservation.mockResolvedValue({ id: '1' });

    const res = await request(app).delete('/api/reservations/1');

    expect(res.status).toBe(204);
  });
});