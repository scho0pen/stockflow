import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Eye, X, AlertTriangle, Package } from 'lucide-react';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los Modales
  const [selectedProduct, setSelectedProduct] = useState(null); // Modal Ver Detalle
  const [reservationToDelete, setReservationToDelete] = useState(null); // Modal Eliminar

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/api/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  // --- 1. Lógica de Imágenes Inteligente ---
  // Esta función intenta "conectar" el producto con su imagen en assets
  const getProductImage = (itemString) => {
    if (!itemString) return '/assets/default-product.png'; // Fallback si es null
    
    // Normalizamos el nombre para buscar el archivo (ej: "Laptop Dell" -> "laptop-dell.jpg")
    // O puedes usar un mapa directo si tienes nombres específicos como P002.jpg
    const imageName = itemString.toLowerCase().replace(/\s+/g, '-');
    
    // Mapeo manual para demostración basado en tus archivos subidos
    // Si el item contiene "Grout" o "Laptop", usamos P002 como ejemplo
    if (itemString.includes('Grout') || itemString.includes('Laptop')) {
        return '/assets/P002.jpg'; 
    }

    // Retorna una ruta genérica si no hay coincidencia específica
    // Puedes subir una imagen llamada 'placeholder.jpg' a tu carpeta assets
    return '/assets/P002.jpg'; 
  };

  // --- Lógica de Eliminación ---
  const requestDelete = (id) => setReservationToDelete(id);

  const confirmDelete = async () => {
    if (!reservationToDelete) return;
    try {
      await axios.delete(`/api/reservations/${reservationToDelete}`);
      setReservations(prev => prev.filter(res => res._id !== reservationToDelete));
      setReservationToDelete(null);
    } catch (err) {
      console.error('Error eliminando:', err);
      alert('Hubo un error al intentar eliminar la reserva.');
    }
  };

  // --- Estilos Visuales Premium ---
  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: '#f0f2f5', // Fondo gris muy suave y moderno
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    container: {
      width: '100%',
      maxWidth: '1100px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.05)', // Sombra difusa elegante
      padding: '30px',
      overflow: 'hidden' // Para que las esquinas redondeadas recorten el contenido
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #f0f0f0'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: 0,
      letterSpacing: '-0.5px'
    },
    tableContainer: {
      overflowX: 'auto', // Responsive
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 10px', // Espacio entre filas
    },
    th: {
      textAlign: 'left',
      padding: '15px 20px',
      color: '#8c98a4',
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
    },
    row: {
      backgroundColor: '#ffffff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    },
    td: {
      padding: '15px 20px',
      borderTop: '1px solid #f9f9f9',
      borderBottom: '1px solid #f9f9f9',
      color: '#333',
      verticalAlign: 'middle',
      fontSize: '0.95rem',
    },
    // Estilos específicos de celdas
    productCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    productImage: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      objectFit: 'cover',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#f0f0f0'
    },
    productName: {
      fontWeight: '600',
      color: '#2c3e50'
    },
    idBadge: {
      fontFamily: 'monospace',
      color: '#adb5bd',
      fontSize: '0.85rem'
    },
    statusBadge: (status) => ({
      padding: '6px 14px',
      borderRadius: '30px',
      fontSize: '0.75rem',
      fontWeight: '700',
      backgroundColor: status === 'Active' ? '#dcfce7' : '#fff7ed',
      color: status === 'Active' ? '#166534' : '#c2410c',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    }),
    price: {
      fontWeight: '700',
      color: '#1a1a1a',
      fontSize: '1rem'
    },
    // Botones de acción
    actionBtn: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '8px'
    },
    btnView: {
      color: '#0ea5e9',
      backgroundColor: '#e0f2fe',
    },
    btnDelete: {
      color: '#ef4444',
      backgroundColor: '#fee2e2',
    },
    // --- Modales ---
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphism claro
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s'
    },
    modalCard: {
      backgroundColor: 'white',
      borderRadius: '24px',
      width: '450px',
      maxWidth: '90%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      border: '1px solid #f0f0f0',
      animation: 'slideUp 0.3s ease-out'
    },
    modalImageHeader: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      backgroundColor: '#f8f9fa'
    },
    modalBody: {
      padding: '30px',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '800',
      marginBottom: '10px',
      color: '#111'
    },
    modalLabel: {
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      color: '#999',
      fontWeight: '700',
      marginBottom: '5px',
      display: 'block'
    },
    modalText: {
      fontSize: '1rem',
      color: '#555',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    modalFooter: {
      padding: '20px 30px',
      backgroundColor: '#fafafa',
      display: 'flex',
      justifyContent: 'flex-end',
      borderTop: '1px solid #eee'
    },
    btnPrimary: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.95rem',
      transition: 'transform 0.1s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }
  };

  if (loading) return (
    <div style={styles.wrapper}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'}}>
        <Package size={40} color="#0ea5e9" style={{animation: 'spin 2s linear infinite'}} />
        <span style={{color: '#666', fontWeight: '500'}}>Cargando inventario...</span>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Panel de Reservas</h2>
          <div style={{fontSize: '0.9rem', color: '#666'}}>
            Total: <strong>{reservations.length}</strong> items
          </div>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>ID Ref</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Valor</th>
                <th style={{...styles.th, textAlign: 'right'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res._id} style={styles.row}>
                  {/* Columna Producto con Imagen */}
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      <img 
                        src={getProductImage(res.productName)} 
                        alt={res.productName}
                        style={styles.productImage}
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/48?text=Product'}} // Fallback si falla la carga
                      />
                      <span style={styles.productName}>{res.productName || 'Producto Desconocido'}</span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <span style={styles.idBadge}>#{res._id.slice(-6).toUpperCase()}</span>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={{fontWeight: '500'}}>{res.user}</div>
                  </td>
                  
                  <td style={styles.td}>
                    <span style={styles.statusBadge(res.status)}>
                      {res.status === 'Active' ? '● Activa' : '○ Pendiente'}
                    </span>
                  </td>
                  
                  <td style={styles.td}>
                    <span style={styles.price}>
                      $ {res.price ? res.price.toLocaleString('es-CO') : '0'}
                    </span>
                  </td>
                  
                  <td style={{...styles.td, textAlign: 'right'}}>
                    <button 
                      style={{...styles.actionBtn, ...styles.btnView}}
                      onClick={() => setSelectedProduct(res)}
                      title="Ver detalle"
                    >
                      <Eye size={20} />
                    </button>

                    <button 
                      style={{...styles.actionBtn, ...styles.btnDelete}}
                      onClick={() => requestDelete(res._id)}
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE DETALLE DEL PRODUCTO (Estilo Card) --- */}
      {selectedProduct && (
        <div style={styles.overlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <img 
              src={getProductImage(selectedProduct.item)} 
              alt={selectedProduct.item} 
              style={styles.modalImageHeader}
            />
            
            <div style={styles.modalBody}>
              <span style={styles.statusBadge(selectedProduct.status)}>
                {selectedProduct.status}
              </span>
              <h3 style={styles.modalTitle}>{selectedProduct.item}</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0'}}>
                <div>
                  <span style={styles.modalLabel}>Precio Unitario</span>
                  <div style={{fontSize: '1.2rem', fontWeight: '700', color: '#0ea5e9'}}>
                    $ {selectedProduct.price ? selectedProduct.price.toLocaleString('es-CO') : '0'}
                  </div>
                </div>
                <div>
                  <span style={styles.modalLabel}>Cantidad</span>
                  <div style={{fontSize: '1.2rem', fontWeight: '600', color: '#333'}}>
                    x {selectedProduct.quantity}
                  </div>
                </div>
              </div>

              <span style={styles.modalLabel}>Descripción</span>
              <p style={styles.modalText}>
                {selectedProduct.description || 'No hay descripción detallada disponible para este producto.'}
              </p>
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={{...styles.btnPrimary, backgroundColor: '#1a1a1a', color: 'white'}}
                onClick={() => setSelectedProduct(null)}
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN (Estilo Alerta) --- */}
      {reservationToDelete && (
        <div style={styles.overlay} onClick={() => setReservationToDelete(null)}>
          <div style={{...styles.modalCard, width: '400px', borderRadius: '20px'}} onClick={(e) => e.stopPropagation()}>
            <div style={{padding: '30px', textAlign: 'center'}}>
              <div style={{
                backgroundColor: '#fee2e2', 
                width: '60px', height: '60px', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <AlertTriangle size={30} color="#ef4444" />
              </div>
              <h3 style={{fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px'}}>
                ¿Eliminar Reserva?
              </h3>
              <p style={{color: '#666', marginBottom: '30px'}}>
                Estás a punto de eliminar este registro permanentemente. Esta acción no se puede deshacer.
              </p>
              
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <button 
                  style={{...styles.btnPrimary, backgroundColor: '#f3f4f6', color: '#4b5563'}}
                  onClick={() => setReservationToDelete(null)}
                >
                  Cancelar
                </button>
                <button 
                  style={{...styles.btnPrimary, backgroundColor: '#ef4444', color: 'white'}}
                  onClick={confirmDelete}
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;