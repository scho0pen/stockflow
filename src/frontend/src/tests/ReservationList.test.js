import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ReservationList from '../components/ReservationList';
import axios from 'axios';

// DIP: Inversión de dependencias (Axios Mock)
jest.mock('axios');

describe('ReservationList Component (SOLID Tests)', () => {

  // Datos mock que cumplen con la estructura real (LSP)
  // Usamos 'productName' y 'status' en español
  const mockReservations = [
    { 
      _id: '64a7f...01', 
      productName: 'Laptop Dell', 
      user: 'Juan Perez', 
      status: 'Activa', 
      price: 1500000, 
      quantity: 1 
    },
    { 
      _id: '64a7f...02', 
      productName: 'Limpiador Ácido', 
      user: 'Maria Gomez', 
      status: 'Cancelada', 
      price: 45000, 
      quantity: 2 
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- TEST DE INTEGRACIÓN: CARGA DE DATOS ---
  test('Debe obtener reservas de la API y renderizarlas en la tabla', async () => {
    // Mock del GET
    axios.get.mockResolvedValue({ data: mockReservations });

    render(<ReservationList />);

    // Esperamos a que el useEffect termine
    await waitFor(() => {
      // Verificamos nombres de productos
      expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
      expect(screen.getByText('Limpiador Ácido')).toBeInTheDocument();
      
      // Verificamos precios formateados (usamos Regex para flexibilidad)
      expect(screen.getByText(/1[.,]500[.,]000/)).toBeInTheDocument();
      expect(screen.getByText(/45[.,]000/)).toBeInTheDocument();
    });
  });

  // --- TEST DE INTEGRACIÓN: VER DETALLE (MODAL) ---
  test('Debe abrir el modal de detalle al hacer click en Ver', async () => {
    axios.get.mockResolvedValue({ data: mockReservations });
    render(<ReservationList />);

    // Esperamos a que cargue
    await screen.findByText('Laptop Dell');

    // Buscamos el botón "Ver detalle" (el ojo). 
    // Como usamos iconos, buscamos por el atributo 'title' que pusimos en el botón
    const viewButtons = screen.getAllByTitle(/Ver detalle/i);
    fireEvent.click(viewButtons[0]);

    // Verificamos que el modal se abre mostrando información extra
    await waitFor(() => {
        expect(screen.getByText(/Precio Unitario/i)).toBeInTheDocument();
        expect(screen.getByText(/Cerrar Detalle/i)).toBeInTheDocument();
    });
  });

  // --- TEST DE INTEGRACIÓN: ELIMINACIÓN ---
  test('Debe eliminar una reserva tras confirmar en el modal', async () => {
    // 1. Configurar mocks
    axios.get.mockResolvedValue({ data: mockReservations });
    axios.delete.mockResolvedValue({}); // Respuesta exitosa al borrar

    render(<ReservationList />);

    // 2. Esperar carga
    await screen.findByText('Laptop Dell');

    // 3. Click en Eliminar (Trash icon)
    const deleteButtons = screen.getAllByTitle(/Eliminar/i);
    fireEvent.click(deleteButtons[0]); // Borramos el primero

    // 4. Verificar que aparece el modal de confirmación
    expect(screen.getByText(/¿Eliminar Reserva?/i)).toBeInTheDocument();

    // 5. Click en "Sí, Eliminar" dentro del modal
    const confirmButton = screen.getByText('Sí, Eliminar');
    fireEvent.click(confirmButton);

    // 6. Verificar que se llamó a axios.delete con el ID correcto
    await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/api/reservations/64a7f...01');
    });
    
    // 7. Verificar actualización optimista (el item desaparece de la UI)
    // Nota: Como axios.get es un mock, React filtrará el array en memoria.
    // Verificamos que ya no esté en el documento.
    await waitFor(() => {
        expect(screen.queryByText('Laptop Dell')).not.toBeInTheDocument();
    });
  });
});