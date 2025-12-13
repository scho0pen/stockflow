import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Eye, X, AlertTriangle, Package } from 'lucide-react';

// 1. URL DEL BACKEND
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [reservationToDelete, setReservationToDelete] = useState(null); 

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      // 2. Aquí SÍ se hace el GET correctamente dentro de una función async
      const res = await axios.get(`${API_URL}/api/reservations`);
      setReservations(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar. Verifica que el backend no esté dormido (Render).');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (reservation) => {
    setReservationToDelete(reservation);
  };

  const confirmDelete = async () => {
    if (!reservationToDelete) return;

    try {
      // 3. DELETE correcto usando la variable de entorno
      await axios.delete(`${API_URL}/api/reservations/${reservationToDelete._id}`);
      
      // Actualización optimista (borrar de la lista visualmente)
      setReservations(prev => prev.filter(r => r._id !== reservationToDelete._id));
      
      setReservationToDelete(null);
      alert('Reserva eliminada exitosamente.');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar la reserva. Revisa la consola (F12) para más detalles.');
    }
  };

  // ... (Tus estilos y JSX siguen aquí igual que antes)
  
  const styles = {
    wrapper: { padding: '40px 20px', backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 60px)', fontFamily: '-apple-system, system-ui, sans-serif' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', marginTop: '20px' },
    th: { padding: '10px', textAlign: 'left', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' },
    td: { padding: '15px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    btnPrimary: { padding: '8px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'background-color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '5px' },
    statusStyle: (status) => {
        let color = '#7f8c8d'; let bg = '#ecf0f1';
        if (status === 'Confirmed') { color = '#27ae60'; bg = '#e6f7ee'; } 
        else if (status === 'Pending') { color = '#f39c12'; bg = '#fef3e7'; } 
        else if (status === 'Cancelled') { color = '#e74c3c'; bg = '#fde6e6'; }
        return { color, backgroundColor: bg, padding: '5px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '0.8rem', textAlign: 'center', display: 'inline-block' };
    },
  };

  if (loading) return <p style={{textAlign: 'center', padding: '50px'}}>Cargando reservas...</p>;
  if (error) return <p style={{textAlign: 'center', padding: '50px', color: '#e74c3c'}}>{error}</p>;
  if (reservations.length === 0) return <p style={{textAlign: 'center', padding: '50px', color: '#666'}}>No hay reservas registradas.</p>;

  return (
    <div style={styles.wrapper}>
      <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', textAlign: 'center'}}>
        <List size={28} style={{marginRight: '10px'}} /> Lista de Reservas
      </h1>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{...styles.th, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', width: '30%'}}>Item</th>
            <th style={styles.th}>Usuario</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Cantidad</th>
            <th style={{...styles.th, borderTopRightRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center', width: '15%'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id}>
              <td style={{...styles.td, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Package size={20} color="#3498db" />
                    <span style={{fontWeight: '600', color: '#333'}}>{res.item || res.productName}</span>
                </div>
              </td>
              <td style={styles.td}>{res.user}</td>
              <td style={styles.td}><span style={styles.statusStyle(res.status)}>{res.status}</span></td>
              <td style={styles.td}><span style={{ color: '#27ae60', fontWeight: 'bold' }}>$ {res.price ? res.price.toLocaleString('es-CO') : '0'}</span></td>
              <td style={styles.td}>{res.quantity}</td>
              <td style={{...styles.td, borderTopRightRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center'}}>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <button style={{...styles.btnPrimary, backgroundColor: '#f1c40f', color: 'white'}} onClick={() => setSelectedProduct(res)}><Eye size={18} /></button>
                    <button style={{...styles.btnPrimary, backgroundColor: '#e74c3c', color: 'white'}} onClick={() => handleDelete(res)}><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reservationToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '400px', width: '90%', position: 'relative' }}>
            <button onClick={() => setReservationToDelete(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}><X size={24} /></button>
            <div style={{padding: '30px', textAlign: 'center'}}>
              <div style={{ backgroundColor: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}><AlertTriangle size={30} color="#ef4444" /></div>
              <h3 style={{fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px'}}>¿Eliminar Reserva?</h3>
              <p style={{color: '#666', marginBottom: '30px'}}>Esta acción no se puede deshacer.</p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <button style={{...styles.btnPrimary, backgroundColor: '#f3f4f6', color: '#4b5563'}} onClick={() => setReservationToDelete(null)}>Cancelar</button>
                <button style={{...styles.btnPrimary, backgroundColor: '#ef4444', color: 'white'}} onClick={confirmDelete}>Sí, Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
