import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component (SOLID Tests)', () => {
  
  // SRP: Solo probamos que el Dashboard muestre la información correcta al usuario
  test('Debe renderizar los KPIs principales y gráficos', () => {
    render(<Dashboard />);

    // 1. Verificar Título Principal
    expect(screen.getByText(/Dashboard de Ventas/i)).toBeInTheDocument(); // O el título que tengas "Resumen"

    // 2. Verificar Tarjetas de KPI (Ventas Totales, Stock)
    // Buscamos por texto parcial usando Regex para ser resilientes a cambios menores
    expect(screen.getByText(/Ventas Totales/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos en Stock/i)).toBeInTheDocument();

    // 3. Verificar Datos (si son estáticos en el componente)
    // Ejemplo: Si el componente muestra $ 223.390.000
    expect(screen.getByText(/223/)).toBeInTheDocument();

    // 4. Verificar secciones de gráficos/listas
    expect(screen.getByText(/Desglose de Mercado/i)).toBeInTheDocument();
    expect(screen.getByText(/Bogotá Regional/i)).toBeInTheDocument();
  });
});