import { render, screen } from '@testing-library/react';
import Inventory from '../src/components/Inventory';

describe('Inventory', () => {
  test('renders product cards', () => {
    render(<Inventory />);
    // Should display first product name
    expect(screen.getByText(/Advanced Grout - Gray/i)).toBeInTheDocument();
    // Should display some other product
    expect(screen.getByText(/Diamond Grinding Wheel - Premium/i)).toBeInTheDocument();
  });
});