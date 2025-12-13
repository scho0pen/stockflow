import React from 'react';

/**
 * Dashboard displays high level KPIs and charts. Data is static for this
 * prototype; integrate real backend calls in a production environment.
 */
function Dashboard() {
  // Static data to mirror the example dashboard
  const totalSales = 223390000;
  const stockCount = 486;
  const topProducts = [
    { name: 'Advanced Grout - Gray', quantity: 340 },
    { name: 'Advanced Grout - White', quantity: 300 },
    { name: 'Diamond Grinding Wheel', quantity: 270 },
    { name: 'Limpiador Ácido', quantity: 200 },
  ];
  const categories = [
    { name: 'Maintenance Products', percent: 42 },
    { name: 'Diamond Grinding Tools', percent: 28 },
    { name: 'Grout', percent: 12 },
    { name: 'Mortars', percent: 18 },
  ];
  const regions = [
    { name: 'Bogotá Centro', percent: 40, sales: 4520 },
    { name: 'Bogotá Norte', percent: 34, sales: 3850 },
    { name: 'Soacha', percent: 17, sales: 1890 },
    { name: 'Chía', percent: 9, sales: 1040 },
  ];

  // --- Estilos para un look Minimalista ---
  // Idealmente, esto estaría en un archivo CSS separado o se usaría Tailwind/Emotion/Styled Components.
  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9', // Fondo sutil
    },
    header: {
      fontSize: '2rem',
      fontWeight: '300', // Fuente más ligera para minimalismo
      marginBottom: '1.5rem',
      color: '#333',
    },
    kpiContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    kpiCard: {
      flex: '1',
      minWidth: '220px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', // Sombra sutil
      borderLeft: '4px solid #4a90e2', // Borde de acento
    },
    kpiTitle: {
      fontSize: '1rem',
      color: '#666',
      margin: '0 0 0.5rem 0',
      fontWeight: '400',
    },
    kpiValue: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 0.25rem 0',
    },
    kpiChangePositive: {
      color: '#2ecc71', // Verde minimalista
      fontSize: '0.9rem',
    },
    chartsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    chartCard: {
      flex: '1',
      minWidth: '300px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: '500',
      color: '#333',
      borderBottom: '1px solid #eee',
      paddingBottom: '0.75rem',
      marginBottom: '1rem',
    },
    barItem: {
      marginBottom: '1rem',
    },
    barText: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.25rem',
      fontSize: '0.9rem',
      color: '#444',
    },
    barBackground: {
      background: '#eef2f6', // Gris muy claro
      height: '8px',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      background: '#4a90e2', // Color de acento
      borderRadius: '4px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      marginBottom: '0.75rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid #f0f0f0',
      color: '#555',
      fontSize: '0.95rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>

      {/* Tarjetas KPI */}
      <div style={styles.kpiContainer}>
        {/* Total Sales */}
        <div style={styles.kpiCard}>
          <h3 style={styles.kpiTitle}>Ventas Totales</h3>
          <p style={styles.kpiValue}>
            $ {totalSales.toLocaleString('es-CO')}
          </p>
          <p style={styles.kpiChangePositive}>+1.9%</p>
        </div>
        {/* Products in stock */}
        <div style={styles.kpiCard}>
          <h3 style={styles.kpiTitle}>Productos en Stock</h3>
          <p style={styles.kpiValue}>{stockCount}</p>
          <p style={styles.kpiChangePositive}>+12 nuevos</p>
        </div>
        {/* Añadir más KPIs aquí si es necesario para llenar el espacio */}
      </div>

      {/* Gráficos y Listas */}
      <div style={styles.chartsContainer}>
        {/* Top Products bar chart placeholder */}
        <div style={styles.chartCard}>
          <h4 style={styles.cardTitle}>Productos Más Vendidos</h4>
          {topProducts.map((item) => (
            <div key={item.name} style={styles.barItem}>
              <div style={styles.barText}>
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </div>
              <div style={styles.barBackground}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${(item.quantity / topProducts[0].quantity) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown pie chart placeholder */}
        <div style={styles.chartCard}>
          <h4 style={styles.cardTitle}>Desglose de Mercado por Categoría</h4>
          <ul style={styles.list}>
            {categories.map((cat) => (
              <li key={cat.name} style={styles.listItem}>
                <span>
                  **{cat.name}**: **{cat.percent}%**
                </span>
                <div style={styles.barBackground}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${cat.percent}%`,
                      // Cambiar color para diferenciar si es necesario
                      backgroundColor: cat.percent > 30 ? '#4a90e2' : '#7ed321', 
                    }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Regional breakdown - Ahora como otra Tarjeta */}
      <div style={styles.chartCard}>
        <h4 style={styles.cardTitle}>Bogotá Regional Sales</h4>
        <ul style={styles.list}>
          {regions.map((reg) => (
            <li key={reg.name} style={styles.listItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{reg.name}</strong>
                <span>
                  {reg.percent}% ({reg.sales.toLocaleString('es-CO')})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;