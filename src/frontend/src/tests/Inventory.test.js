import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Inventory from '../components/Inventory';
import axios from 'axios';

jest.mock('axios');

describe('Inventory Component (SOLID Tests)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe renderizar la lista de productos correctamente', () => {
    render(<Inventory />);
    expect(screen.getByText(/Protector Stonprotec/i)).toBeInTheDocument();
    expect(screen.getByText(/Limpiador Ácido/i)).toBeInTheDocument();
  });

  test('Debe realizar una reserva exitosa y mostrar el modal de confirmación', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<Inventory />);

    const reserveButtons = screen.getAllByRole('button', { name: /Reservar/i });
    const firstButton = reserveButtons[0];

    fireEvent.click(firstButton);

    await waitFor(() => {
      // CORRECCIÓN 1: Usamos expect.stringContaining para que pase con localhost o URL relativa
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/reservations'), 
        expect.objectContaining({
            productName: expect.any(String),
            status: 'Activa',
            quantity: 1
        })
      );

      // CORRECCIÓN 2: Verificar el modal
      expect(screen.getByText(/¡Reserva Exitosa!/i)).toBeInTheDocument();
    });
  });

  test('Debe manejar errores si la API falla', async () => {
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
