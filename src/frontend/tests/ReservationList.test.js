import { render, screen, waitFor } from '@testing-library/react';
import ReservationList from '../src/components/ReservationList';
import axios from 'axios';

jest.mock('axios');

describe('ReservationList', () => {
  test('displays no reservations message', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<ReservationList />);
    await waitFor(() => expect(screen.getByText(/No hay reservas/i)).toBeInTheDocument());
  });

  test('displays reservations table', async () => {
    const data = [
      { _id: '1', description: 'Producto A', price: 100, quantity: 1, status: 'Pendiente' },
    ];
    axios.get.mockResolvedValue({ data });
    render(<ReservationList />);
    await waitFor(() => expect(screen.getByText('Producto A')).toBeInTheDocument());
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });
});