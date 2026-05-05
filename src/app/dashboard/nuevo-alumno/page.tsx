'use client';

import Link from 'next/link';
import { createStudentAction } from '@/app/actions/student';
import { useState } from 'react';

export default function NuevoAlumnoPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Navbar */}
      <header className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Ingreso de Alumno</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Escuela Pucara Alto</span>
        </div>
        <Link href="/dashboard" className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
          Volver al Panel
        </Link>
      </header>

      <main className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Formulario de Matrícula PIE</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>Complete los antecedentes del estudiante y los datos de contactabilidad (muy importantes para notificaciones).</p>

        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid #f87171', borderRadius: '8px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form action={async (formData) => {
          const res = await createStudentAction(formData);
          // if createStudentAction redirects on success, we won't hit this unless there's an error
          if (res?.error) {
            setError(res.error);
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Sección 1: Identificación del Alumno */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#60a5fa' }}>1. Identificación del Alumno</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Nombre Completo</label>
                <input type="text" name="nombre" className="glass-input" placeholder="Ej. Juan Pérez" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>RUT</label>
                <input type="text" name="rut" className="glass-input" placeholder="12.345.678-9" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Curso</label>
                <input type="text" name="curso" className="glass-input" placeholder="Ej. 3° Básico A" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Diagnóstico PIE</label>
                <input type="text" name="diagnostico" className="glass-input" placeholder="Ej. TEL / TEA" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Sexo</label>
                <select name="sexo" className="glass-input" required style={{ width: '100%', appearance: 'none', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <option value="" style={{ color: '#000' }}>Seleccione...</option>
                  <option value="Niño" style={{ color: '#000' }}>Niño</option>
                  <option value="Niña" style={{ color: '#000' }}>Niña</option>
                  <option value="Otro" style={{ color: '#000' }}>Otro</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" className="glass-input" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fotografía del Alumno (Opcional)</label>
                <input type="file" name="foto" accept="image/*" className="glass-input" style={{ padding: '8px' }} />
              </div>
            </div>
          </div>

          {/* Sección 2: Adulto a Cargo y Contactabilidad */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#c084fc' }}>2. Adulto a Cargo y Contacto</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>* Los datos de contacto son vitales. Se priorizará el teléfono.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Nombre del Apoderado/Adulto</label>
                <input type="text" name="apoderado" className="glass-input" placeholder="Nombre completo" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Teléfono (Prioridad 1)</label>
                <input type="tel" name="telefono" className="glass-input" placeholder="+56 9 1234 5678" required style={{ borderLeft: '3px solid #60a5fa' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Correo Electrónico (Prioridad 2)</label>
                <input type="email" name="correo" className="glass-input" placeholder="apoderado@correo.cl" />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/dashboard" className="glass-button" style={{ padding: '10px 20px', textDecoration: 'none' }}>
              Cancelar
            </Link>
            <button type="submit" className="glass-button primary" style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Guardar y Matricular
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
