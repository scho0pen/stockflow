const request = require('supertest');
const app = require('../../src/app');
const Reservation = require('../../src/models/reservationModel');

jest.mock('../../src/models/reservationModel');

describe('Reservation Routes Integration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET (List) ---
  test('GET /api/reservations returns list', async () => {
    const mockReservations = [
      { _id: '1', productName: 'Laptop', price: 1000 },
      { _id: '2', productName: 'Proyector', price: 500 }
    ];
    Reservation.find.mockResolvedValue(mockReservations);

    const res = await request(app).get('/api/reservations');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].productName).toBe('Laptop');
  });

  // --- POST (Create) ---
  test('POST /api/reservations creates reservation', async () => {
    const newRes = { 
      productName: 'New Item', 
      price: 150, 
      user: 'TestUser', 
      quantity: 1, 
      description: 'Desc',
      status: 'Activa' 
    };

    // CORRECCIÓN CLAVE:
    // Mockeamos el constructor de la clase Reservation
    Reservation.mockImplementation((data) => ({
      ...data, // Mantenemos los datos que le pasamos al constructor
      save: jest.fn().mockResolvedValue({ _id: '123', ...data }) // save devuelve la promesa resuelta
    }));

    const res = await request(app)
      .post('/api/reservations')
      .send(newRes);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // Ahora sí, res.body.data tendrá los datos porque el mock los preservó
    expect(res.body.data.productName).toBe('New Item');
  });

  // --- PUT (Update) ---
  test('PUT /api/reservations/:id updates reservation', async () => {
    const updatedData = { status: 'Confirmada' };
    
    Reservation.findByIdAndUpdate.mockResolvedValue({ 
      _id: '1', 
      productName: 'Laptop', 
      status: 'Confirmada' 
    });

    const res = await request(app)
      .put('/api/reservations/1')
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Confirmada');
  });

  // --- DELETE ---
  test('DELETE /api/reservations/:id deletes reservation', async () => {
    Reservation.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const res = await request(app).delete('/api/reservations/1');

    expect(res.status).toBe(204);
  });
});
