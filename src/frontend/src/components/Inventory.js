import React from 'react';
import axios from 'axios';
const IMAGE_BASE_URL = '/assets';
/**
 * Inventory component displays a catalog of products available for reservation. A
 * button allows the user to reserve a product which triggers a POST call
 * against the backend API.
 */
function Inventory() {
  // Hard-coded product list; in real app fetch from backend
  const products = [
    {
      id: 'P001',
      name: ' Protector Stonprotec® Ecoston Plus ',
      price: 115960,
      description: 'Tratamiento hidro-oleo repelente base agua, formulado para reducir la absorción y proteger piedras naturales.',
      stock: 42,
    },
    {
      id: 'P002',
      name: ' Limpiador Ácido – Stonprotec® ',
      price: 41960,
      description: 'Limpiador especializado para final de obra.',
      stock: 48,
    },
    {
      id: 'P003',
      name: 'Diamond Grinding Wheel - Premium',
      price: 519960,
      description: 'Professional diamond grinding wheel for stone surfaces, ideal for granite, marble and concrete finishing.',
      stock: 22,
    },
    {
      id: 'P004',
      name: 'Jabón Líquido – Stonprotec®',
      price: 159960,
      description: 'Jabón líquido pH neutro concentrado para una limpieza diaria de superficies de piedra. Fórmula suave que protege y mantiene el brillo natural.',
      stock: 62,
    },
    {
      id: 'P005',
      name: 'Limpia Fachadas y Terrazas – Stonprotec®',
      price: 211960,
      description: 'Limpiador especializado para fachadas y terrazas de piedra. Elimina suciedad, moho y contaminación ambiental sin dañar las superficies.',
      stock: 28,
    },
    {
      id: 'P006',
      name: 'Limpiador Ácido – Stonprotec®',
      price: 187960,
      description: 'Limpiador ácido profesional para eliminación de residuos de cemento, sarro y eflorescencia en superficies de piedra. Uso profesional.',
      stock: 12,
    },
    {
      id: 'P007',
      name: 'Limpiador mesones y superficies - Stonprotec®',
      price: 183960,
      description: 'Limpiador de fácil aplicación para mesones y superficies de mármol y granito.',
      stock: 45,
    },
    {
      id: 'P008',
      name: 'Limpiador mesones y superficies - Stonprotec®',
      price: 171960,
      description: 'Limpiador de fácil aplicación para mesones y superficies de mármol y granito.',
      stock: 38,
    },
    {
      id: 'P009',
      name: 'Limpiador mesones y superficies - Stonprotec®',
      price: 179960,
      description: 'Limpiador de fácil aplicación para mesones y superficies de mármol y granito.',
      stock: 52,
    },
    {
      id: 'P010',
      name: 'Limpiador mesones y superficies - Stonprotec®',
      price: 175960,
      description: 'Limpiador de fácil aplicación para mesones y superficies de mármol y granito.',
      stock: 48,
    },
    {
      id: 'P011',
      name: 'Limpieza Intensiva - Stonprotec®',
      price: 195960,
      description: 'Limpiador de alta potencia para limpieza profunda de superficies de piedra natural y artificial. Elimina manchas difíciles y suciedad acumulada.',
      stock: 35,
    },
    {
      id: 'P012',
      name: 'Premium Mortar Mix - 25kg',
      price: 139960,
      description: 'High‑quality mortar mix for stone and tile installation, perfect for indoor and outdoor applications.',
      stock: 65,
    },
  ];

  const reserveProduct = async (product) => {
    try {
      const payload = {
        user: 'demo', // In a real app, use authenticated user id
        productName: product.name,
        description: product.description,
        price: product.price,
        quantity: 1,
      };
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/reservations';
      const response = await axios.post(apiUrl, payload);
      alert(`Reserva creada con ID ${response.data._id}`);
    } catch (error) {
      console.error(error);
      alert('Error al crear la reserva');
    }
  };

// --- Estilos para un look Minimalista (Catálogo) ---
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
    grid: {
      display: 'grid',
      // Diseño de rejilla responsiva para 3-4 columnas
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      // Estilo al pasar el ratón (simulado con pseudo-clase)
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
    image: {
      width: '100%',
      height: '180px', // Un poco más alta que 150px
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '1rem',
      border: '1px solid #eee',
    },
    productName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 0.5rem 0',
      minHeight: '44px', // Ayuda a alinear las descripciones si los títulos varían
    },
    description: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1rem',
      flexGrow: 1, // Permite que la descripción empuje el contenido inferior
    },
    price: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#4a90e2', // Color de acento
      margin: '0 0 0.5rem 0',
    },
    stock: (inStock) => ({
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '1rem',
      color: inStock > 20 ? '#2ecc71' : inStock > 0 ? '#f39c12' : '#e74c3c', // Semáforo de stock
    }),
    button: {
      padding: '0.75rem',
      width: '100%',
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      // Estilo al pasar el ratón (simulado)
      ':hover': {
        backgroundColor: '#357abd',
      },
    },
  };

  // Función para manejar el hover (React no soporta pseudo-clases en `style` directamente)
  // Tendrías que usar un estado o una librería CSS-in-JS real, pero para esta demostración, 
  // mantendremos el estilo en línea lo más limpio posible y simularemos el hover solo en el comentario.  

return (
    <div style={styles.container}>
      <h2 style={styles.header}>Inventario</h2>
      
      <div style={styles.grid}>
        {products.map((product) => (
          // Aplicamos el estilo de la tarjeta directamente.
          <div key={product.id} style={styles.card}> 
            
            {/* Imagen Placeholder */}
            <img
              src={`${IMAGE_BASE_URL}/${encodeURIComponent(product.name)}.jpg`}
              alt={product.name}
              style={styles.image}
            />
            
            <h4 style={styles.productName}>{product.name}</h4>
            
            <p style={styles.description}>{product.description}</p>
            
            <p style={styles.price}>
              $ {product.price.toLocaleString('es-CO')}
            </p>
            
            {/* Uso de la función de stock para el color condicional */}
            <p style={styles.stock(product.stock)}>
              Stock: {product.stock} unidades
            </p>
            
            <button 
              onClick={() => reserveProduct(product)} 
              style={styles.button}
              disabled={product.stock === 0} // Deshabilitar si no hay stock
            >
              {product.stock > 0 ? 'Reservar Ahora' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;