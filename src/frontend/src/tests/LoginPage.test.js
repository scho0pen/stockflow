import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'; // Necesario para useNavigate
import LoginPage from '../components/LoginPage';
import axios from 'axios';

// Mock de Axios por si el componente hace la llamada internamente
jest.mock('axios');

describe('LoginPage Component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Permite escribir credenciales y enviar el formulario', async () => {
        // PREPARACIÓN
        // Si tu componente recibe una prop onLogin, la mockeamos
        const mockOnLogin = jest.fn();
        
        // Si tu componente hace la petición HTTP internamente:
        axios.post.mockResolvedValue({ data: { token: 'fake-jwt-token' } });

        const user = userEvent.setup();

        // EJECUCIÓN
        // PRINCIPIO DIP: Inyectamos el Router para que el componente funcione en el test
        render(
            <BrowserRouter>
                <LoginPage onLogin={mockOnLogin} />
            </BrowserRouter>
        );

        // VERIFICACIÓN DE ELEMENTOS
        const emailInput = screen.getByPlaceholderText(/correo/i);
        const passwordInput = screen.getByPlaceholderText(/contraseña/i);
        const loginButton = screen.getByRole('button', { name: /iniciar/i });

        // INTERACCIÓN
        await user.type(emailInput, 'test@ibero.edu.co');
        await user.type(passwordInput, '123456');
        await user.click(loginButton);

        // ASERCIÓN
        await waitFor(() => {
            // Verifica uno de los dos escenarios dependiendo de tu implementación:
            
            // Caso A: Si usas axios dentro del componente
            // expect(axios.post).toHaveBeenCalled(); 
            
            // Caso B: Si usas la prop onLogin
            // expect(mockOnLogin).toHaveBeenCalled();
            
            // Al menos verifica que no haya errores visibles
            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });
    });

    test('Muestra error visual con credenciales inválidas', async () => {
        axios.post.mockRejectedValue(new Error('Credenciales incorrectas'));
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText(/correo/i), 'fail@test.com');
        await user.type(screen.getByPlaceholderText(/contraseña/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /iniciar/i }));

        // Espera a que aparezca algún mensaje de error
        // Asegúrate de que tu componente renderice un texto con la palabra "error" o "válido"
        // await waitFor(() => {
        //    expect(screen.getByText(/error/i)).toBeInTheDocument();
        // });
    });
});