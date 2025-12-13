const mongoose = require('mongoose');
const connectDB = require('../../src/config/db'); // Ajusta la ruta si es necesario

// Mockeamos mongoose para no intentar una conexión real
jest.mock('mongoose');

describe('Database Configuration (db.js)', () => {
  // Guardamos las referencias originales de console para restaurarlas luego
  const originalEnv = process.env;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks de mongoose
    process.env = { ...originalEnv }; // Clona las variables de entorno
    process.env.MONGODB_URI = 'mongodb://fake-uri:27017/test'; // URI falsa para el test

    // Espiamos console.log y console.error para verificar que se llamen
    // y usamos .mockImplementation(() => {}) para silenciar la salida en la terminal
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    process.env = originalEnv; // Restauramos el entorno original
  });

  test('Debe conectarse a MongoDB exitosamente', async () => {
    // A. Preparación: Simulamos que connect se resuelve correctamente
    mongoose.connect.mockResolvedValueOnce('Success');

    // B. Ejecución
    await connectDB();

    // C. Verificación (Líneas 4-10)
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://fake-uri:27017/test',
      expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Connected to MongoDB');
  });

  test('Debe lanzar un error si la conexión falla', async () => {
    // A. Preparación: Simulamos un error de conexión
    const errorMock = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(errorMock);

    // B. Ejecución y Verificación (Líneas 11-13)
    // Esperamos que la función lance el error (throw error)
    await expect(connectDB()).rejects.toThrow('Connection failed');

    // Verificamos que se haya registrado el error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', errorMock);
  });
});