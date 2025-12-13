const request = require('supertest');
const app = require('../../src/app');

// --- SOLUCIÓN DEL TIMEOUT ---
// Mockeamos las rutas para que NO carguen controladores ni intenten conectar a la BD.
// Esto hace que '/api/reservations' sea manejado por este router falso instantáneo.
jest.mock('../../src/routes/reservationRoutes', () => {
  const express = require('express');
  const router = express.Router();
  // Definimos una ruta GET raíz (que corresponde a /api/reservations/)
  router.get('/', (req, res) => res.status(200).json({ message: 'Ruta mockeada' }));
  return router;
});

describe('Application (app.js)', () => {
  
  it('GET /health debe retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('Debe tener montadas las rutas de /api/reservations', async () => {
    // Ahora esto responderá rápido gracias al mock, sin timeout
    const res = await request(app).get('/api/reservations');
    
    // Esperamos 200 (porque nuestro mock devuelve 200) 
    // Lo importante es que NO sea 404 (que significaría ruta no montada)
    expect(res.statusCode).not.toBe(404);
    expect(res.statusCode).toBe(200); 
  });
});