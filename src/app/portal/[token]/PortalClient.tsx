'use client';

import { useState } from 'react';
import { markMaterialAsAccessedAction } from '@/app/actions/material';

interface PortalClientProps {
  alumno: any;
  materiales: any[];
}

export default function PortalClient({ alumno, materiales }: PortalClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Separar materiales por estado
  const materialPendiente = materiales.filter(m => m.estado !== 'Completado');
  const materialCompletado = materiales.filter(m => m.estado === 'Completado');

  // Configuración del Calendario Gantt (Mes actual dinámico o fijo por ahora)
  const now = new Date();
  const currentMonth = now.toLocaleString('es-CL', { month: 'long' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  // Función para obtener el día del mes de una fecha DD-MM-YYYY
  const getDayFromStr = (dateStr: string) => {
    if (!dateStr) return 0;
    const parts = dateStr.split('-');
    if (parts.length < 3) return 0;
    return parseInt(parts[0]);
  };

  const filteredPendiente = materialPendiente.filter(item => 
    item.actividad.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.asignatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <header className="glass-panel" style={{ width: '100%', maxWidth: '1000px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ 
          display: 'inline-block',
          padding: '4px 12px', 
          borderRadius: '20px', 
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#60a5fa',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1rem',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          Escuela Pucara Alto - Equipo PIE
        </span>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Portal Familiar</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', margin: 0 }}>
          Material Educativo de <strong>{alumno.nombre}</strong> ({alumno.curso})
        </p>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Calendario Gantt */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Calendario de Actividades ({currentMonth})
            </h2>
          </div>

          <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
            <div style={{ minWidth: '800px' }}>
              {/* Encabezado de días */}
              <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)`, gap: '2px', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 'bold' }}>Actividad</div>
                {calendarDays.map(day => (
                  <div key={day} style={{ textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8' }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Tareas Pendientes en Gantt */}
              {materiales.map(item => {
                const diaInicio = getDayFromStr(item.inicio);
                const diaTermino = getDayFromStr(item.termino);
                
                if (!diaInicio || !diaTermino) return null;

                const start = diaInicio;
                const span = diaTermino - diaInicio + 1;
                const isCompletado = item.estado === 'Completado';

                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)`, gap: '2px', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem' }}>
                      {item.actividad}
                    </div>
                    <div style={{ 
                      gridColumn: `${start + 1} / span ${span}`, 
                      background: isCompletado ? 'rgba(74, 222, 128, 0.2)' : 'rgba(250, 204, 21, 0.2)', 
                      border: isCompletado ? '1px solid #4ade80' : '1px solid #facc15', 
                      borderRadius: '4px', 
                      height: '20px', 
                      position: 'relative' 
                    }}>
                    </div>
                  </div>
                );
              })}
              {materiales.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>No hay actividades programadas este mes.</p>}
            </div>
          </div>
        </section>

        {/* Material Pendiente Detallado */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#facc15', display: 'inline-block', boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}></span>
            Material Pendiente de Trabajo
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredPendiente.map(item => {
              // Calcular días restantes
              const [d, m, y] = item.termino.split('-').map(Number);
              const deadlineDate = new Date(y, m - 1, d);
              const today = new Date();
              today.setHours(0,0,0,0);
              const diffTime = deadlineDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays < 0;

              return (
                <article key={item.id} className="glass-panel" style={{ 
                  padding: '2rem', 
                  borderLeft: isOverdue ? '4px solid #f87171' : '4px solid #facc15', 
                  position: 'relative',
                  backgroundColor: isOverdue ? 'rgba(248, 113, 113, 0.05)' : 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                     Subido: {item.carga}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{item.actividad}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Asignado por: {item.profesor}</p>
                    </div>
                    <div style={{ 
                      textAlign: 'right', 
                      background: isOverdue ? 'rgba(248, 113, 113, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: isOverdue ? '1px solid rgba(248, 113, 113, 0.3)' : '1px solid rgba(250, 204, 21, 0.3)' 
                    }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: isOverdue ? '#f87171' : '#facc15', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {isOverdue ? '¡ACTIVIDAD ATRASADA!' : 'Plazo de ejecución'}
                      </span>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>
                        {item.inicio} al {item.termino}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: isOverdue ? '#fca5a5' : '#cbd5e1', marginTop: '4px' }}>
                        {isOverdue 
                          ? `Han pasado ${Math.abs(diffDays)} días del límite` 
                          : diffDays === 0 ? '¡Vence hoy!' : `Faltan ${diffDays} días para el cierre`
                        }
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.875rem', color: '#60a5fa', margin: '0 0 0.25rem 0' }}>Objetivos a trabajar:</h4>
                    <p style={{ fontSize: '0.875rem', color: '#e2e8f0', margin: '0 0 1rem 0' }}>{item.objetivos || 'No especificados'}</p>
                    
                    <h4 style={{ fontSize: '0.875rem', color: '#c084fc', margin: '0 0 0.25rem 0' }}>Recomendaciones para el hogar:</h4>
                    <p style={{ fontSize: '0.875rem', color: '#e2e8f0', margin: 0 }}>{item.recomendaciones || 'No hay recomendaciones adicionales.'}</p>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    {item.archivoUrl ? (
                      <button 
                        onClick={async () => {
                          await markMaterialAsAccessedAction(item.id);
                          window.open(item.archivoUrl, '_blank');
                        }}
                        className="glass-button primary" 
                        style={{ width: '100%', maxWidth: '300px', padding: '14px 24px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Abrir Material Educativo
                      </button>
                    ) : (
                      <button disabled className="glass-button" style={{ width: '100%', maxWidth: '300px', padding: '14px 24px', opacity: 0.5 }}>
                        Sin archivo adjunto
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {filteredPendiente.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8' }}>No hay materiales pendientes.</p>}
          </div>
        </section>

        {/* Material Completado / Revisado */}
        {materialCompletado.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
              Material Revisado Anteriormente
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {materialCompletado.map(item => (
                <article key={item.id} className="glass-panel" style={{ padding: '1.5rem', opacity: 0.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', color: '#cbd5e1' }}>{item.actividad}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Enviado por: {item.profesor}</p>
                    </div>
                    <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                      Volver a ver
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer style={{ marginTop: '4rem', color: '#64748b', fontSize: '0.875rem', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>Escuela Pucara Alto - Programa de Integración Escolar</p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>Si tiene dudas, comuníquese con el equipo profesional.</p>
      </footer>
    </div>
  );
}
