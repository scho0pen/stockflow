import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Activity, DollarSign, Package, PieChart } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function Dashboard() {
  // Estado para los datos reales
  const [stats, setStats] = useState({
    totalSales: 0,
    reservedItems: 0,
    topProducts: [],
    statusBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reservations/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- Estilos (Simplificados para brevedad) ---
  const styles = {
    container: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' },
    header: { marginBottom: '30px' },
    title: { fontSize: '2rem', fontWeight: '800', color: '#1a1a1a' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    kpiLabel: { fontSize: '0.9rem', color: '#6b7280', marginBottom: '5px' },
    kpiValue: { fontSize: '2rem', fontWeight: '800', color: '#111827' },
    sectionTitle: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#374151' },
    list: { listStyle: 'none', padding: 0 },
    listItem: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' },
    progressBarBg: { height: '8px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '4px', marginTop: '8px' },
    progressBarFill: (percent) => ({ height: '100%', width: `${Math.min(percent, 100)}%`, backgroundColor: '#4f46e5', borderRadius: '4px' })
  };

  if (loading) return <div style={{padding: '40px'}}>Cargando estadísticas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Resumen de Negocio</h2>
        <p style={{color: '#666'}}>Métricas en tiempo real basadas en tus reservas</p>
      </div>

      {/* --- TARJETAS DE KPI --- */}
      <div style={styles.grid}>
        {/* Ventas Totales */}
        <div style={styles.card}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
            <div style={{padding:'10px', background:'#ecfccb', borderRadius:'10px'}}><DollarSign size={24} color="#4d7c0f"/></div>
            <span style={styles.kpiLabel}>Ventas Totales</span>
          </div>
          <span style={styles.kpiValue}>$ {stats.totalSales.toLocaleString('es-CO')}</span>
          <span style={{fontSize:'0.8rem', color:'#4d7c0f'}}>+ Calculado de Reservas Activas</span>
        </div>

        {/* Items Reservados */}
        <div style={styles.card}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
            <div style={{padding:'10px', background:'#dbeafe', borderRadius:'10px'}}><Package size={24} color="#1d4ed8"/></div>
            <span style={styles.kpiLabel}>Items Reservados</span>
          </div>
          <span style={styles.kpiValue}>{stats.reservedItems}</span>
          <span style={{fontSize:'0.8rem', color:'#1d4ed8'}}>Unidades comprometidas</span>
        </div>
        
        {/* Estado de Reservas */}
        <div style={styles.card}>
           <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
            <div style={{padding:'10px', background:'#f3e8ff', borderRadius:'10px'}}><Activity size={24} color="#7e22ce"/></div>
            <span style={styles.kpiLabel}>Actividad</span>
          </div>
          <div style={{display: 'flex', gap: '15px', marginTop: '5px'}}>
             {stats.statusBreakdown.map(s => (
               <div key={s.status}>
                 <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>{s.count}</div>
                 <div style={{fontSize: '0.75rem', color: '#666'}}>{s.status}</div>
               </div>
             ))}
             {stats.statusBreakdown.length === 0 && <span>Sin actividad</span>}
          </div>
        </div>
      </div>

      {/* --- GRÁFICOS (TOP PRODUCTOS) --- */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px'}}>
        
        {/* Top Productos */}
        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Productos Más Vendidos</h4>
          <ul style={styles.list}>
            {stats.topProducts.map((prod) => (
              <li key={prod.name} style={styles.listItem}>
                <div style={{width: '100%'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: '600', color: '#374151'}}>{prod.name}</span>
                    <span style={{color: '#6b7280'}}>{prod.quantity} unids.</span>
                  </div>
                  {/* Barra de progreso visual basada en cantidad (asumiendo max 50 para el ejemplo) */}
                  <div style={styles.progressBarBg}>
                    <div style={styles.progressBarFill((prod.quantity / Math.max(stats.reservedItems, 1)) * 100 * 2)}></div>
                  </div>
                  <div style={{fontSize: '0.8rem', color: '#9ca3af', marginTop: '5px'}}>
                    Ingresos: $ {prod.revenue.toLocaleString('es-CO')}
                  </div>
                </div>
              </li>
            ))}
            {stats.topProducts.length === 0 && <p style={{color: '#999'}}>No hay datos de ventas aún.</p>}
          </ul>
        </div>

        {/* Nota informativa sobre gráficas faltantes */}
        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Desglose Regional y Categorías</h4>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', textAlign: 'center'}}>
            <PieChart size={48} style={{marginBottom: '15px', opacity: 0.5}}/>
            <p>
              Actualmente, tu base de datos de reservas no incluye campos de "Región" o "Categoría".
            </p>
            <p style={{fontSize: '0.9rem', marginTop: '10px'}}>
              Para ver estos gráficos, necesitamos actualizar el modelo de datos para capturar esa información en cada reserva.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
