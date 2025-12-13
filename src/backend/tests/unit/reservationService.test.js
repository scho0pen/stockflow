const ReservationService = require('../../src/services/reservationService');

// Datos de prueba falsos basados en tu esquema
const mockData = {
  user: 'UsuarioTest',
  productName: 'Laptop',
  description: 'Reparacion',
  price: 100,
  quantity: 1,
  status: 'Activa'
};

describe('ReservationService Unit Tests', () => {
  let service;
  let mockModel;

  beforeEach(() => {
    // --- MOCK (Simulación) DE MONGOOSE ---
    // Creamos un objeto que finge ser el modelo de Mongoose
    mockModel = {
      // Simulamos métodos estáticos (find, findById, etc.)
      find: jest.fn(() => ({ sort: jest.fn().mockResolvedValue([mockData]) })),
      findById: jest.fn().mockResolvedValue(mockData),
      findByIdAndUpdate: jest.fn().mockResolvedValue(mockData),
      findByIdAndDelete: jest.fn().mockResolvedValue(mockData),
    };

    // Simulamos el constructor del modelo (new Model(data)) y el método .save()
    // Esto es un truco necesario porque tu servicio usa "new this.ReservationModel()"
    const mockModelConstructor = jest.fn((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data) // save devuelve los mismos datos
    }));

    // Copiamos los métodos estáticos al constructor simulado
    Object.assign(mockModelConstructor, mockModel);

    // INYECTAMOS el modelo falso al servicio
    service = new ReservationService(mockModelConstructor);
  });

  test('createReservation debería guardar y retornar la reserva', async () => {
    const result = await service.createReservation(mockData);
    
    expect(result).toEqual(mockData);
    expect(result.productName).toBe('Laptop');
  });

  test('getAllReservations debería retornar lista ordenada', async () => {
    const result = await service.getAllReservations();
    
    expect(mockModel.find).toHaveBeenCalled(); // Verifica que se llamó a la DB
    expect(result).toEqual([mockData]);
  });
});