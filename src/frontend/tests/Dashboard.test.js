import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/Dashboard';

describe('Dashboard', () => {
  test('displays total sales and stock count', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Ventas Totales/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos en Stock/i)).toBeInTheDocument();
  });
});