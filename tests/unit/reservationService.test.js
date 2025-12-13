const reservationService = require('../../src/services/reservationService');
const ReservationModel = require('../../src/models/reservationModel');

// Interceptamos la llamada al modelo real.
jest.mock('../../src/models/reservationModel');

const mockData = {
  _id: '12345',
  user: 'UsuarioTest',
  item: 'Laptop',
  description: 'Reparacion',
  price: 100,
  quantity: 1,
  status: 'Activa'
};

describe('ReservationService Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  // --- Pruebas Existentes ---

  test('createReservation debería guardar y retornar la reserva', async () => {
    const mockSave = jest.fn().mockResolvedValue(mockData);
    ReservationModel.mockImplementation(() => ({
      save: mockSave
    }));

    const result = await reservationService.createReservation(mockData);
    
    expect(ReservationModel).toHaveBeenCalledWith(mockData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('getAllReservations debería retornar lista ordenada', async () => {
    const mockSort = jest.fn().mockResolvedValue([mockData]);
    const mockFind = jest.fn().mockReturnValue({
      sort: mockSort
    });
    ReservationModel.find = mockFind;

    const result = await reservationService.getAllReservations();
    
    expect(ReservationModel.find).toHaveBeenCalled();
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual([mockData]);
  });

  // --- NUEVAS PRUEBAS PARA SUBIR LA COBERTURA (Líneas 32-51) ---

  test('getReservationById debería retornar una reserva por ID', async () => {
    // Simulamos que findById devuelve los datos mock
    ReservationModel.findById = jest.fn().mockResolvedValue(mockData);

    const result = await reservationService.getReservationById('12345');

    expect(ReservationModel.findById).toHaveBeenCalledWith('12345');
    expect(result).toEqual(mockData);
  });

  test('getReservationById debería retornar null si no existe', async () => {
    // Simulamos que no encuentra nada
    ReservationModel.findById = jest.fn().mockResolvedValue(null);

    const result = await reservationService.getReservationById('id_falso');

    expect(ReservationModel.findById).toHaveBeenCalledWith('id_falso');
    expect(result).toBeNull();
  });

  test('updateReservation debería actualizar y retornar la nueva reserva', async () => {
    const updateData = { status: 'Completada' };
    const updatedMock = { ...mockData, ...updateData };

    // Simulamos findByIdAndUpdate. 
    // Es crucial devolver el objeto actualizado porque tu servicio usa { new: true }
    ReservationModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMock);

    const result = await reservationService.updateReservation('12345', updateData);

    expect(ReservationModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '12345', 
      updateData, 
      { new: true } // Verificamos que se pase la opción correcta
    );
    expect(result).toEqual(updatedMock);
  });

  test('deleteReservation debería eliminar y retornar la reserva eliminada', async () => {
    ReservationModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockData);

    const result = await reservationService.deleteReservation('12345');

    expect(ReservationModel.findByIdAndDelete).toHaveBeenCalledWith('12345');
    expect(result).toEqual(mockData);
  });
});