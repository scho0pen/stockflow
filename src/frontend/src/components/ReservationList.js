import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * ReservationList fetches and displays all reservations. Users can view
 * reservation details and delete reservations. Status values mirror the
 * backend enumeration.
 */
function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/reservations';

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(apiBase);
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [apiBase]);

  const deleteReservation = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      await axios.delete(`${apiBase}/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la reserva');
    }
  };

  // --- Estilos para un look Minimalista (Tabla de Lista) ---
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#fef3c7', color: '#fbbf24' }; // Amarillo
      case 'Confirmed':
        return { backgroundColor: '#d1fae5', color: '#10b981' }; // Verde
      case 'Shipped':
        return { backgroundColor: '#cffafe', color: '#06b6d4' }; // Azul cielo
      case 'Cancelled':
        return { backgroundColor: '#fee2e2', color: '#ef4444' }; // Rojo
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '2rem',
      fontWeight: '300',
      marginBottom: '1.5rem',
      color: '#333',
    },
    tableWrapper: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      padding: '1rem 1.5rem',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      letterSpacing: '0.05em',
    },
    td: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb',
      color: '#374151',
      fontSize: '0.9rem',
    },
    statusBadge: (status) => ({
      ...getStatusStyle(status),
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontWeight: '600',
      fontSize: '0.75rem',
    }),
    buttonView: {
      padding: '0.5rem 1rem',
      marginRight: '0.5rem',
      backgroundColor: '#4a90e2', // Azul primario
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#357abd',
      },
    },
    buttonDelete: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444', // Rojo para acción destructiva
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#dc2626',
      },
    },
    tableRow: {
        transition: 'background-color 0.1s',
        ':hover': {
          backgroundColor: '#f9fafb',
        },
      },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Lista de Reservas</h2>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando...</p>
      ) : reservations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No hay reservas actualmente.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, borderTopLeftRadius: '8px' }}>ID</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Estado</th>
                <th style={{ ...styles.th, borderTopRightRadius: '8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res._id} style={styles.tableRow}>
                  <td style={styles.td}>{res._id}</td>
                  <td style={styles.td}>
                    <strong>{res.description}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>
                      $ {res.price.toLocaleString('es-CO')}
                    </span>
                  </td>
                  <td style={styles.td}>{res.quantity}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(res.status)}>{res.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => alert(JSON.stringify(res, null, 2))} 
                      style={styles.buttonView}
                    >
                      Ver
                    </button>
                    <button 
                      onClick={() => deleteReservation(res._id)}
                      style={styles.buttonDelete}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReservationList;