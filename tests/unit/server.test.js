describe('Server Startup (server.js)', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    jest.resetModules(); // Limpia la caché para re-ejecutar server.js desde cero
    jest.clearAllMocks();

    // Silenciamos los logs
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Debe iniciar el servidor correctamente si la DB conecta', async () => {
    // 1. Mockear la BD para que devuelva una PROMESA RESUELTA
    jest.doMock('../../src/config/db', () => jest.fn(() => Promise.resolve('Conectado')));

    // 2. Mockear app.listen para evitar abrir puertos reales
    const listenMock = jest.fn((port, callback) => callback && callback());
    jest.doMock('../../src/app', () => ({
      listen: listenMock
    }));

    // 3. Requerir el archivo server (esto dispara la ejecución)
    require('../../src/server');

    // 4. Esperar a que las promesas se resuelvan (tick del event loop)
    await Promise.resolve(); 

    // 5. Verificar
    expect(listenMock).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Server running'));
  });

  test('Debe cerrar el proceso si la conexión a la DB falla', async () => {
    // 1. Mockear la BD para que devuelva una PROMESA RECHAZADA (Error)
    const errorSimulado = new Error('Fallo crítico en DB');
    jest.doMock('../../src/config/db', () => jest.fn(() => Promise.reject(errorSimulado)));

    // 2. Mockear app para asegurar que NO se llame a listen
    const listenMock = jest.fn();
    jest.doMock('../../src/app', () => ({
      listen: listenMock
    }));

    // 3. Requerir el archivo server
    require('../../src/server');

    // 4. Esperar a que el catch capture el error
    await Promise.resolve();
    await Promise.resolve(); // Un tick extra por seguridad

    // 5. Verificar
    expect(consoleErrorSpy).toHaveBeenCalledWith(errorSimulado);
    expect(processExitSpy).toHaveBeenCalledWith(1);
    expect(listenMock).not.toHaveBeenCalled();
  });
});