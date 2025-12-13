import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Inventory from '../components/Inventory';
import axios from 'axios';

// DIP: Mockeamos Axios para no depender de la red real
jest.mock('axios');

describe('Inventory Component (SOLID Tests)', () => {
  
  // Limpieza antes de cada test para cumplir SRP y evitar efectos secundarios
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- TEST UNITARIO: RENDERIZADO ---
  test('Debe renderizar la lista de productos correctamente', () => {
    render(<Inventory />);
    
    // Verificamos que los productos estáticos se muestren
    // (Asumiendo que los datos están hardcodeados en el componente como en tu código)
    expect(screen.getByText(/Protector Stonprotec/i)).toBeInTheDocument();
    expect(screen.getByText(/Limpiador Ácido/i)).toBeInTheDocument();
  });

  // --- TEST DE INTEGRACIÓN: FLUJO DE RESERVA ---
  test('Debe realizar una reserva exitosa y mostrar el modal de confirmación', async () => {
    // PREPARACIÓN (Arrange)
    // Simulamos una respuesta exitosa del backend
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<Inventory />);

    // EJECUCIÓN (Act)
    // 1. Encontrar el botón de reservar del primer producto (que tenga stock)
    // Nota: Usamos getAllByRole porque hay varios botones
    const reserveButtons = screen.getAllByRole('button', { name: /Reservar/i });
    const firstButton = reserveButtons[0];

    // 2. Simular click del usuario
    fireEvent.click(firstButton);

    // VERIFICACIÓN (Assert)
    await waitFor(() => {
      // 1. Verificar que se llamó a la API con los datos correctos (LSP)
      // Aseguramos que envíe 'productName' y 'status: Activa' como corregimos antes
      expect(axios.post).toHaveBeenCalledWith('/api/reservations', expect.objectContaining({
        productName: expect.any(String),
        status: 'Activa',
        quantity: 1
      }));

      // 2. Verificar que aparece el Modal de Éxito (Feedback visual)
      expect(screen.getByText(/¡Reserva Exitosa!/i)).toBeInTheDocument();
    });
  });

  // --- TEST DE INTEGRACIÓN: MANEJO DE ERRORES ---
  test('Debe manejar errores si la API falla', async () => {
    // Mockeamos un error y silenciamos la consola para este test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    axios.post.mockRejectedValue(new Error('Error del servidor'));

    render(<Inventory />);

    const reserveButtons = screen.getAllByRole('button', { name: /Reservar/i });
    fireEvent.click(reserveButtons[0]);

    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});