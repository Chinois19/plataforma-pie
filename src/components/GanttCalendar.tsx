'use client';

import { useState } from 'react';

interface GanttCalendarProps {
  materiales: any[];
}

export default function GanttCalendar({ materiales }: GanttCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    // Format is assumed to be DD-MM-YYYY
    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1; // 0-indexed
    const y = parseInt(parts[2]);

    const itemDate = new Date(y, m, d);
    return itemDate;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Filtrar y calcular posiciones de los materiales para el mes actual
  const monthMaterials = materiales.map(item => {
    const startDate = getDayBoundsForMonth(item.inicio);
    const endDate = getDayBoundsForMonth(item.termino);
    
    if (!startDate || !endDate) return null;

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    // Si la actividad ocurre completamente antes o completamente después de este mes, no mostrarla
    if (endDate < monthStart || startDate > monthEnd) return null;

    // Calcular inicio visible
    let startDay = 1;
    if (startDate >= monthStart) {
      startDay = startDate.getDate();
    }

    // Calcular fin visible
    let endDay = daysInMonth;
    if (endDate <= monthEnd) {
      endDay = endDate.getDate();
    }

    const span = endDay - startDay + 1;

    return {
      ...item,
      startDay,
      span,
      isCompletado: item.estado === 'Completado'
    };
  }).filter(Boolean);

  return (
    <section className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Calendario de Actividades
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
          <button onClick={handlePrevMonth} className="glass-button" style={{ padding: '4px 12px' }}>&larr; Ant</button>
          <span style={{ minWidth: '150px', textAlign: 'center', fontWeight: 'bold', textTransform: 'capitalize' }}>{currentMonthName}</span>
          <button onClick={handleNextMonth} className="glass-button" style={{ padding: '4px 12px' }}>Sig &rarr;</button>
          <button onClick={handleToday} className="glass-button primary" style={{ padding: '4px 12px', marginLeft: '0.5rem' }}>Hoy</button>
        </div>
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

          {/* Tareas en Gantt */}
          {monthMaterials.map((item: any) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)`, gap: '2px', marginBottom: '0.5rem', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.5rem' }} title={item.actividad}>
                {item.actividad}
              </div>
              <div style={{ 
                gridColumn: `${item.startDay + 1} / span ${item.span}`, 
                background: item.isCompletado ? 'rgba(74, 222, 128, 0.2)' : 'rgba(250, 204, 21, 0.2)', 
                border: item.isCompletado ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(250, 204, 21, 0.5)', 
                borderRadius: '4px', 
                height: '20px', 
                position: 'relative' 
              }} title={`${item.inicio} al ${item.termino}`}>
              </div>
            </div>
          ))}
          {monthMaterials.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>No hay actividades programadas en este período.</p>}
        </div>
      </div>
    </section>
  );
}
