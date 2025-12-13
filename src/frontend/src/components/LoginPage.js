import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          {/* CORRECCIÓN 1: Agregamos htmlFor */}
          <label htmlFor="email">Correo Electrónico</label>
          <input
            id="email" // CORRECCIÓN 2: Agregamos id coincidente
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          {/* CORRECCIÓN 3: Lo mismo para contraseña */}
          <label htmlFor="password">Contraseña</label>
          <input
            id="password" // ID Coincidente
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
