'use client';

import { useState } from 'react';

interface GanttCalendarProps {
  materiales: any[];
}

export default function GanttCalendar({ materiales }: GanttCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const currentMonthName = currentDate.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

  // Función para obtener el día del mes si coincide con el mes actual, o ajustar a los bordes
  const getDayBoundsForMonth = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length < 3) return null;
    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1; 
    const y = parseInt(parts[2]);
    return new Date(y, m, d);
  };

  const getStatusColor = (item: any) => {
    if (item.estado === 'Completado') return '#4ade80'; // Verde
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const [d, m, y] = item.termino.split('-').map(Number);
    const endDate = new Date(y, m-1, d);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#f87171'; // Rojo (Atrasado)
    if (diffDays <= 3) return '#facc15'; // Amarillo (Casi vence)
    return '#4ade80'; // Verde (A tiempo)
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const toggleGroup = (prof: string) => {
    setCollapsedGroups(prev => 
      prev.includes(prof) ? prev.filter(p => p !== prof) : [...prev, prof]
    );
  };

  // Filtrar y calcular posiciones
  const monthMaterials = materiales.map(item => {
    const startDate = getDayBoundsForMonth(item.inicio);
    const endDate = getDayBoundsForMonth(item.termino);
    if (!startDate || !endDate) return null;

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    if (endDate < monthStart || startDate > monthEnd) return null;

    let startDay = 1;
    if (startDate >= monthStart) startDay = startDate.getDate();

    let endDay = daysInMonth;
    if (endDate <= monthEnd) endDay = endDate.getDate();

    const span = endDay - startDay + 1;
    const color = getStatusColor(item);
    const isOverdue = color === '#f87171' && item.estado !== 'Completado';

    return { ...item, startDay, span, color, isOverdue };
  }).filter(Boolean);

  // Agrupar por profesional
  const groupedByProf = monthMaterials.reduce((acc: any, item: any) => {
    if (!acc[item.profesor]) acc[item.profesor] = [];
    acc[item.profesor].push(item);
    return acc;
  }, {});

  const profesionales = Object.keys(groupedByProf);

  return (
    <section className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Calendario de Actividades
        </h2>
        
        {/* Leyenda Semáforo */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', background: '#f87171', borderRadius: '50%' }}></span> Atrasado</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', background: '#facc15', borderRadius: '50%' }}></span> Próximo Vence</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></span> En Tiempo / Ok</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg-subtle)', padding: '0.5rem', borderRadius: '12px' }}>
          <button onClick={handlePrevMonth} className="glass-button" style={{ padding: '4px 12px' }}>&larr; Ant</button>
          <span style={{ minWidth: '150px', textAlign: 'center', fontWeight: 'bold', textTransform: 'capitalize' }}>{currentMonthName}</span>
          <button onClick={handleNextMonth} className="glass-button" style={{ padding: '4px 12px' }}>Sig &rarr;</button>
          <button onClick={handleToday} className="glass-button primary" style={{ padding: '4px 12px', marginLeft: '0.5rem' }}>Hoy</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ minWidth: '800px' }}>
          {/* Encabezado de días */}
          <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${daysInMonth}, 1fr)`, gap: '2px', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border-subtle)', paddingBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', fontWeight: 'bold' }}>Profesional / Actividad</div>
            {calendarDays.map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--foreground-muted)' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Secciones por Profesional */}
          {profesionales.map(prof => (
            <div key={prof} style={{ marginBottom: '1rem' }}>
              <button 
                onClick={() => toggleGroup(prof)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  background: 'var(--glass-bg-subtle)', 
                  border: 'none', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  color: 'var(--foreground)', 
                  fontWeight: 'bold', 
                  fontSize: '0.875rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <span>{collapsedGroups.includes(prof) ? '▶' : '▼'}</span>
                {prof} 
                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>({groupedByProf[prof].length} actividades)</span>
              </button>

              {!collapsedGroups.includes(prof) && groupedByProf[prof].map((item: any) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${daysInMonth}, 1fr)`, gap: '2px', marginBottom: '4px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: '1.5rem', paddingRight: '0.5rem' }} title={item.actividad}>
                    {item.actividad}
                  </div>
                  <div style={{ 
                    gridColumn: `${item.startDay + 1} / span ${item.span}`, 
                    background: item.color + '33', 
                    border: `1px solid ${item.color}88`, 
                    borderRadius: '4px', 
                    height: '24px', 
                    position: 'relative',
                    cursor: 'help'
                  }} title={`ACTIVIDAD: ${item.actividad}\nPROFESIONAL: ${item.profesor}\nINICIO: ${item.inicio}\nTÉRMINO: ${item.termino}\nESTADO: ${item.estado}`}>
                    {item.isOverdue && (
                      <span style={{ 
                        position: 'absolute', 
                        right: '-85px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        fontSize: '0.65rem', 
                        color: '#f87171', 
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        background: 'rgba(248, 113, 113, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(248, 113, 113, 0.2)'
                      }}>
                        ⚠️ ATRASADO
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {profesionales.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--foreground-muted)' }}>No hay actividades programadas para este mes.</p>}
        </div>
      </div>
    </section>
  );
}
