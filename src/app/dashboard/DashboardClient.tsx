'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { logoutAction } from '@/app/actions/auth';

export default function DashboardClient({ initialAlumnos, initialAuditoria, user }: { initialAlumnos: any[], initialAuditoria: any[], user: any }) {
  const [alumnos, setAlumnos] = useState<any[]>(initialAlumnos);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Filtrar los que están "dados de alta" localmente (simulación adicional que pidió el usuario)
    const dadosDeAlta = JSON.parse(localStorage.getItem('alumnosDadosDeAlta') || '[]');
    setAlumnos(initialAlumnos.filter((a: any) => !dadosDeAlta.includes(a.id.toString())));
  }, [initialAlumnos]);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Navbar */}
      <header className="glass-panel" style={{ width: '100%', maxWidth: '1000px', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Marca de agua del logo en el recuadro */}
        <div style={{ position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
          <img src="/logo.jpg" alt="" style={{ height: '140px', filter: 'grayscale(100%)', opacity: 0.5 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Panel PIE</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', marginTop: '4px' }}>Escuela Pucara Alto - {user.nombre} ({user.rol})</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem' }}>
          {user.isAdmin && (
            <Link href="/dashboard/profesionales" className="glass-button primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              Gestión Profesionales
            </Link>
          )}
          <button onClick={() => logoutAction()} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Listado de Alumnos */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border-subtle)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Mis Alumnos</h3>
            <Link href="/dashboard/nuevo-alumno" className="glass-button primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
              + Ingresar Alumno
            </Link>
          </div>
          {alumnos.length === 0 ? (
            <p style={{ color: 'var(--foreground-muted)', textAlign: 'center', margin: '2rem 0' }}>No hay alumnos en la modalidad a distancia.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alumnos.map(alumno => (
                <li key={alumno.id} style={{ background: 'var(--glass-bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{alumno.nombre}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>{alumno.curso}</span>
                  </div>
                  <Link href={`/dashboard/alumno/${alumno.id}`} className="glass-button primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    Ver Ficha
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Auditoría de Docentes */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border-subtle)', paddingBottom: '0.5rem' }}>
            Auditoría de Material
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialAuditoria.map(item => (
              <li key={item.id} style={{ padding: '1rem', borderLeft: '3px solid var(--primary)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '0 8px 8px 0' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>{item.profesional}</strong> {item.accion} <span style={{ color: '#60a5fa' }}>{item.archivo}</span> para {item.alumno}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{item.tiempo}</span>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  );
}
