const request = require('supertest');
const app = require('../../src/app');
const reservationService = require('../../src/services/reservationService');

jest.mock('../../src/services/reservationService');

describe('Reservation Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/reservations returns list', async () => {
    const data = [{ id: '1' }, { id: '2' }];
    reservationService.getAllReservations.mockResolvedValue(data);
    const res = await request(app).get('/api/reservations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
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