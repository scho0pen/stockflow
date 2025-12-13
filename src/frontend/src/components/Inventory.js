import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, Package, AlertCircle, Info } from 'lucide-react';

// --- DATA SOURCE (SRP: Separación de datos) ---
const PRODUCTS = [
  {
    id: 'P001',
    name: 'Protector Stonprotec® Ecoston Plus',
    price: 115960,
    description: 'Tratamiento hidro-oleo repelente base agua para piedras naturales.',
    stock: 42,
  },
  {
    id: 'P002',
    name: 'Limpiador Ácido–Stonprotec®',
    price: 41960,
    description: 'Limpiador especializado para final de obra y manchas difíciles.',
    stock: 48,
  },
  {
    id: 'P003',
    name: 'Impregnante-Stonprotec®',
    price: 19960,
    description: 'Producto oleo-hidro repelente de manchas, para la protección.',
    stock: 22,
  },
  {
    id: 'P004',
    name: 'Jabón Líquido – Stonprotec®',
    price: 15960,
    description: 'Jabón pH neutro concentrado para mantenimiento diario.',
    stock: 0, // Ejemplo sin stock
  },
];

// --- HELPER: Gestión de Imágenes ---
const getProductImage = (name) => {
  // Lógica para mapear nombres a archivos reales en public/assets
  if (name.includes('Limpiador') || name.includes('Stonprotec')) return '/assets/P002.jpg';
  // Fallback a una imagen por defecto o placeholder profesional
  return '/assets/P002.jpg'; 
};

// --- SUB-COMPONENTE: Tarjeta de Producto (SRP) ---
const ProductCard = ({ product, onReserve, loading }) => {
  const isOut = product.stock === 0;

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    },
    imageContainer: {
      height: '200px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    badge: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      backgroundColor: isOut ? '#fee2e2' : '#dcfce7',
      color: isOut ? '#ef4444' : '#166534',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    content: { padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' },
    title: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' },
    desc: { fontSize: '0.9rem', color: '#666', lineHeight: '1.5', marginBottom: '20px', flex: 1 },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
    price: { fontSize: '1.25rem', fontWeight: '800', color: '#2c3e50' },
    button: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: isOut ? '#f3f4f6' : '#1a1a1a',
      color: isOut ? '#9ca3af' : 'white',
      fontWeight: '600',
      cursor: isOut ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.card} onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
    }} onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.04)';
    }}>
      <div style={styles.imageContainer}>
        <span style={styles.badge}>{isOut ? 'Agotado' : `Stock: ${product.stock}`}</span>
        <img 
          src={getProductImage(product.name)} 
          alt={product.name} 
          style={styles.image}
          onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
        />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>$ {product.price.toLocaleString('es-CO')}</span>
          <button 
            style={styles.button} 
            onClick={() => onReserve(product)} 
            disabled={isOut || loading}
          >
            <ShoppingCart size={18} />
            {loading ? '...' : 'Reservar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: Modal de Éxito (SRP) ---
const SuccessModal = ({ data, onClose }) => {
  if (!data) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
      animation: 'fadeIn 0.2s'
    },
    card: {
      backgroundColor: 'white', padding: '40px', borderRadius: '24px',
      width: '400px', textAlign: 'center',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f0f0f0',
      animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    icon: {
      width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
    },
    btn: {
      marginTop: '25px', padding: '12px 30px', backgroundColor: '#166534',
      color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600',
      cursor: 'pointer', fontSize: '1rem', width: '100%'
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.card} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.icon}>
          <CheckCircle size={40} color="#166534" />
        </div>
        <h2 style={{margin: '0 0 10px', color: '#1a1a1a'}}>¡Reserva Exitosa!</h2>
        <p style={{color: '#666', lineHeight: '1.5'}}>
          Has reservado <strong>1 unidad</strong> de<br/>
          <span style={{color: '#166534', fontWeight: '600'}}>{data.item}</span>
        </p>
        <button style={modalStyles.btn} onClick={onClose}>Entendido</button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Inventory = () => {
  const [reservingId, setReservingId] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleReserve = async (product) => {
    setReservingId(product.id);
    
    // Payload compatible con tu ReservationController
    const reservationData = {
      productName: product.name,
      user: 'Usuario Actual', // En una app real vendría del contexto de Auth
      quantity: 1,
      price: product.price,
      description: product.description,
      status: 'Activa'
    };

    try {
      await axios.post('/api/reservations', reservationData);
      setSuccessData(reservationData); // Dispara el modal
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor. Intenta nuevamente.');
    } finally {
      setReservingId(null);
    }
  };

  const styles = {
    wrapper: {
      padding: '40px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh',
      fontFamily: '-apple-system, system-ui, sans-serif'
    },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: {
      marginBottom: '40px', textAlign: 'center'
    },
    title: { fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px' },
    subtitle: { color: '#6b7280', fontSize: '1.1rem' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '30px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Catálogo Disponible</h1>
          <p style={styles.subtitle}>Explora nuestros productos y reserva en línea</p>
        </div>

        <div style={styles.grid}>
          {PRODUCTS.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onReserve={handleReserve}
              loading={reservingId === prod.id}
            />
          ))}
        </div>
      </div>

      <SuccessModal 
        data={successData} 
        onClose={() => setSuccessData(null)} 
      />
    </div>
  );
};

export default Inventory;