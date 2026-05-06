'use client';

import { useState } from 'react';
import { markMaterialAsAccessedAction } from '@/app/actions/material';
import GanttCalendar from '@/components/GanttCalendar';

interface PortalClientProps {
  alumno: any;
  materiales: any[];
}

export default function PortalClient({ alumno, materiales }: PortalClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTimeInUse = (fechaApertura: string | null) => {
    if (!fechaApertura) return '';
    const diffMs = new Date().getTime() - new Date(fechaApertura).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `Hace ${diffMins} min.`;
    if (diffHrs < 24) return `Hace ${diffHrs} h.`;
    return `Hace ${diffDays} días`;
  };

  // Separar materiales por estado
  const materialPendiente = materiales.filter(m => m.estado !== 'Completado');
  const materialCompletado = materiales.filter(m => m.estado === 'Completado');



  const filteredPendiente = materialPendiente.filter(item => 
    item.actividad.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.asignatura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <header className="glass-panel" style={{ width: '100%', maxWidth: '1000px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Marca de agua del logo en el recuadro */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
          <img src="/logo.jpg" alt="" style={{ height: '140px', filter: 'grayscale(100%)', opacity: 0.5 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          <p style={{ color: 'var(--foreground-subtle)', fontSize: '1.1rem', margin: 0 }}>
            Material Educativo de <strong>{alumno.nombre}</strong> ({alumno.curso})
          </p>
        </div>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Calendario Gantt Dinámico */}
        <GanttCalendar materiales={materiales} />

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
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--glass-bg-subtle)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                     Subido: {item.carga}
                     {item.fecha_apertura && (
                       <span style={{ display: 'block', marginTop: '4px', color: '#60a5fa', fontWeight: 'bold' }}>
                         En uso: {formatTimeInUse(item.fecha_apertura)}
                       </span>
                     )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--foreground)' }}>{item.actividad}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', margin: 0 }}>Asignado por: {item.profesor}</p>
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
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: 'var(--foreground)' }}>
                        {item.inicio} al {item.termino}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: isOverdue ? '#fca5a5' : 'var(--foreground-muted)', marginTop: '4px' }}>
                        {isOverdue 
                          ? `Han pasado ${Math.abs(diffDays)} días del límite` 
                          : diffDays === 0 ? '¡Vence hoy!' : `Faltan ${diffDays} días para el cierre`
                        }
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--glass-bg-subtle)', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.875rem', color: '#60a5fa', margin: '0 0 0.25rem 0' }}>Objetivos a trabajar:</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: '0 0 1rem 0' }}>{item.objetivos || 'No especificados'}</p>
                    
                    <h4 style={{ fontSize: '0.875rem', color: '#c084fc', margin: '0 0 0.25rem 0' }}>Recomendaciones para el hogar:</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0 }}>{item.recomendaciones || 'No hay recomendaciones adicionales.'}</p>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    {item.link && item.link !== '#' ? (
                      <button 
                        onClick={async () => {
                          await markMaterialAsAccessedAction(item.id);
                          window.open(item.link, '_blank');
                          window.location.reload();
                        }}
                        className="glass-button primary" 
                        style={{ width: '100%', maxWidth: '300px', padding: '14px 24px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Abrir Google Docs
                      </button>
                    ) : (
                      <button disabled className="glass-button" style={{ width: '100%', maxWidth: '300px', padding: '14px 24px', opacity: 0.5 }}>
                        Sin archivo ni link
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
