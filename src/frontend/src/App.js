import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ReservationList from './components/ReservationList';

const navStyles = {
  nav: {
    padding: '1rem 2rem', // Más padding horizontal
    backgroundColor: 'white', // Fondo blanco limpio
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Sombra sutil
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#4a90e2', // Usando nuestro color de acento
    textDecoration: 'none',
    marginRight: '2rem',
  },
  link: {
    color: '#333', // Color de texto oscuro
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  // Nota: En un entorno real, manejarías el hover y el estado 'active' (seleccionado) 
  // con librerías CSS-in-JS o clases CSS para aplicar los estilos de hover:
  // linkHover: {
  //   backgroundColor: '#eef2f6', // Fondo gris claro al pasar el ratón
  // }
};

/**
 * Main application component containing route definitions and layout. A simple
 * navigation bar is provided to switch between views. In a real application
 * authentication state would be used to protect routes.
 */
function App() {
  return (
    <div>
      <nav style={navStyles.nav}>
        {/* Usamos un Link para simular un logo/título que lleva al dashboard */}
        <Link to="/" style={navStyles.logo}>
          📦 StockFlow
        </Link>
        
        {/* Enlaces de Navegación */}
        <Link 
            to="/" 
            style={navStyles.link} 
            // Para simular el estado activo o hover sin librerías:
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f6'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            Inicio
        </Link>
        <Link 
            to="/inventory" 
            style={navStyles.link}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f6'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            Inventario
        </Link>
        <Link 
            to="/reservations" 
            style={navStyles.link}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f6'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            Reservas
        </Link>

        {/* Podrías añadir un enlace de Login o Perfil a la derecha aquí */}
        {/* <Link to="/login" style={{...navStyles.link, marginLeft: 'auto'}}>Login</Link> */}
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/" element={<Dashboard />} />
        {/* redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;