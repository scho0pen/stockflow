import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../components/LoginPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe renderizar el formulario de inicio de sesión correctamente', () => {
    render(<LoginPage />);

    // SOLUCIÓN AMBIGÜEDAD: Buscamos específicamente el Encabezado (h2)
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();

    // Verificamos Inputs por su etiqueta (ahora funciona porque arreglamos el componente)
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    
    // SOLUCIÓN AMBIGÜEDAD: Buscamos específicamente el Botón
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  test('Debe permitir escribir en los campos de texto', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@ibero.edu.co' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('test@ibero.edu.co');
    expect(passwordInput.value).toBe('123456');
  });

  test('Debe redirigir al Dashboard ("/") al enviar el formulario', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
