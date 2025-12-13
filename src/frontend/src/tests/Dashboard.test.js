import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import axios from 'axios';

// Mockeamos axios para simular datos reales
jest.mock('axios');

describe('Dashboard Component', () => {

  // Datos de prueba (lo que respondería el Backend)
  const mockStats = {
    totalSales: 5000000,
    reservedItems: 15,
    topProducts: [
      { name: 'Producto Top 1', quantity: 10, revenue: 100000 },
      { name: 'Producto Top 2', quantity: 5, revenue: 50000 }
    ],
    statusBreakdown: [
      { status: 'Activa', count: 15 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe renderizar los KPIs principales (Ventas y Stock)', async () => {
    // 1. Configuramos el mock para que devuelva nuestros datos
    axios.get.mockResolvedValue({ data: mockStats });

    render(<Dashboard />);

    // 2. Esperamos a que termine de cargar
    await waitFor(() => {
      expect(screen.queryByText(/Cargando estadísticas/i)).not.toBeInTheDocument();
    });

    // 3. Verificamos que aparezcan los textos
    expect(screen.getByText(/Ventas Totales/i)).toBeInTheDocument();
    expect(screen.getByText(/Items Reservados/i)).toBeInTheDocument(); 

    // 4. Verificamos los valores numéricos
    expect(screen.getByText(/5\.000\.000/)).toBeInTheDocument(); 
    
    // --- CORRECCIÓN AQUÍ ---
    // Como el '15' sale dos veces, usamos getAllByText y verificamos que haya al menos uno.
    const itemsCount = screen.getAllByText('15');
    expect(itemsCount.length).toBeGreaterThanOrEqual(1); 
  });

  test('Debe mostrar la lista de productos más vendidos', async () => {
    axios.get.mockResolvedValue({ data: mockStats });
    render(<Dashboard />);

    await waitFor(() => screen.getByText(/Productos Más Vendidos/i));

    expect(screen.getByText(/Productos Más Vendidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Producto Top 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Producto Top 2/i)).toBeInTheDocument();
  });

  test('Debe mostrar el mensaje de categorías faltantes', async () => {
    axios.get.mockResolvedValue({ data: mockStats });
    render(<Dashboard />);

    await waitFor(() => screen.getByText(/Desglose Regional y Categorías/i));

    expect(screen.getByText(/Desglose Regional y Categorías/i)).toBeInTheDocument();
    expect(screen.getByText(/no incluye campos de "Región"/i)).toBeInTheDocument();
  });
});
