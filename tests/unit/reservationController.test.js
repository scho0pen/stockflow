const reservationController = require('../../src/controllers/reservationController');
const reservationService = require('../../src/services/reservationService');
const httpMocks = require('node-mocks-http');

// Mockeamos el servicio para aislar el controlador
jest.mock('../../src/services/reservationService');

describe('Reservation Controller - Unit Tests', () => {
    let req, res, next;

    // Configuración inicial antes de cada test
    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        jest.clearAllMocks(); // Limpia los mocks anteriores
    });

    // --- TEST: CREATE (Crear) ---
    describe('create', () => {
        it('Debe crear una reserva exitosamente (201)', async () => {
            const mockData = { item: 'Laptop', user: 'Juan' };
            req.body = mockData;
            reservationService.createReservation.mockResolvedValue(mockData);

            await reservationController.create(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual(mockData);
        });

        it('Debe retornar 400 si ocurre un error al crear', async () => {
            reservationService.createReservation.mockRejectedValue(new Error('Datos inválidos'));

            await reservationController.create(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toHaveProperty('message', 'Error creating reservation');
        });
    });

    // --- TEST: LIST (Listar todas) ---
    describe('list', () => {
        it('Debe listar todas las reservas (200)', async () => {
            const mockList = [{ item: 'Proyector' }, { item: 'Laptop' }];
            reservationService.getAllReservations.mockResolvedValue(mockList);

            await reservationController.list(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockList);
        });

        it('Debe retornar 500 si falla el servicio', async () => {
            reservationService.getAllReservations.mockRejectedValue(new Error('Error DB'));

            await reservationController.list(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toHaveProperty('message', 'Error fetching reservations');
        });
    });

    // --- TEST: GET BY ID (Obtener por ID) ---
    describe('getById', () => {
        it('Debe retornar una reserva si existe (200)', async () => {
            req.params.id = '123';
            const mockItem = { id: '123', item: 'Tablet' };
            reservationService.getReservationById.mockResolvedValue(mockItem);

            await reservationController.getById(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockItem);
        });

        it('Debe retornar 404 si la reserva no existe', async () => {
            req.params.id = '999';
            reservationService.getReservationById.mockResolvedValue(null);

            await reservationController.getById(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toHaveProperty('message', 'Reservation not found');
        });

        it('Debe retornar 500 si hay error interno', async () => {
            req.params.id = 'error_id';
            reservationService.getReservationById.mockRejectedValue(new Error('Fallo conexión'));

            await reservationController.getById(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toHaveProperty('message', 'Error fetching reservation');
        });
    });

    // --- TEST: UPDATE (Actualizar) ---
    describe('update', () => {
        it('Debe actualizar una reserva existente (200)', async () => {
            req.params.id = '123';
            req.body = { status: 'Finalizada' };
            const updatedItem = { id: '123', status: 'Finalizada' };
            reservationService.updateReservation.mockResolvedValue(updatedItem);

            await reservationController.update(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(updatedItem);
        });

        it('Debe retornar 404 si intenta actualizar algo inexistente', async () => {
            req.params.id = '999';
            reservationService.updateReservation.mockResolvedValue(null);

            await reservationController.update(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toHaveProperty('message', 'Reservation not found');
        });

        it('Debe retornar 400 si hay un error en la actualización', async () => {
            req.params.id = '123';
            reservationService.updateReservation.mockRejectedValue(new Error('Validación fallida'));

            await reservationController.update(req, res);

            expect(res.statusCode).toBe(400); // Según tu código devuelve 400 en catch
            expect(res._getJSONData()).toHaveProperty('message', 'Error updating reservation');
        });
    });

    // --- TEST: DELETE (Eliminar) ---
    describe('delete', () => {
        it('Debe eliminar una reserva existente (204)', async () => {
            req.params.id = '123';
            const deletedItem = { id: '123', item: 'Borrar' };
            reservationService.deleteReservation.mockResolvedValue(deletedItem);

            await reservationController.delete(req, res);

            expect(res.statusCode).toBe(204);
            expect(res._isEndCalled()).toBeTruthy(); // Verifica que se llamó .send()
        });

        it('Debe retornar 404 si intenta eliminar algo inexistente', async () => {
            req.params.id = '999';
            reservationService.deleteReservation.mockResolvedValue(null);

            await reservationController.delete(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toHaveProperty('message', 'Reservation not found');
        });

        it('Debe retornar 500 si falla la eliminación', async () => {
            req.params.id = 'error_id';
            reservationService.deleteReservation.mockRejectedValue(new Error('Error grave'));

            await reservationController.delete(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toHaveProperty('message', 'Error deleting reservation');
        });
    });
});