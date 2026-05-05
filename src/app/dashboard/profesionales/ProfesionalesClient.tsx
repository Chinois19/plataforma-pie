'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toggleProfessionalStatus, createProfessional } from '@/app/actions/admin';

export default function ProfesionalesClient({ user, initialProfesionales }: { user: any, initialProfesionales: any[] }) {
  const [profesionales, setProfesionales] = useState(initialProfesionales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const res = await toggleProfessionalStatus(id, currentStatus);
    if (res.success) {
      setProfesionales(prev => prev.map(p => p.id === id ? { ...p, activo: !currentStatus } : p));
    } else {
      alert(res.error);
    }
  };

  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const res = await createProfessional(formData);
    if (res.success) {
      window.location.reload(); // Simple reload to get updated list from server
    } else {
      setError(res.error || 'Error desconocido');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header className="glass-panel" style={{ width: '100%', maxWidth: '1000px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Gestión de Profesionales</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Panel de Administrador</span>
        </div>
        <Link href="/dashboard" className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
          Volver al Panel
        </Link>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Formulario de Creación */}
        <section className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Nuevo Profesional
          </h3>
          <form action={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</div>}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#cbd5e1' }}>Nombre Completo</label>
              <input name="nombre" type="text" className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#cbd5e1' }}>RUN</label>
              <input name="run" type="text" className="glass-input" placeholder="Ej. 12.345.678-9" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#cbd5e1' }}>Rol / Cargo</label>
              <select name="rol" className="glass-input" required style={{ width: '100%', appearance: 'none', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <option value="" style={{ color: '#000' }}>Seleccione un rol...</option>
                <option value="Fonoaudiólogo/a" style={{ color: '#000' }}>Fonoaudiólogo/a</option>
                <option value="Psicólogo/a" style={{ color: '#000' }}>Psicólogo/a</option>
                <option value="Educador/a Diferencial" style={{ color: '#000' }}>Educador/a Diferencial</option>
                <option value="Terapeuta Ocupacional" style={{ color: '#000' }}>Terapeuta Ocupacional</option>
                <option value="Trabajador/a Social" style={{ color: '#000' }}>Trabajador/a Social</option>
                <option value="Coordinador/a PIE" style={{ color: '#000' }}>Coordinador/a PIE</option>
                <option value="Kinesiólogo/a" style={{ color: '#000' }}>Kinesiólogo/a</option>
                <option value="Otro" style={{ color: '#000' }}>Otro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#cbd5e1' }}>Correo</label>
              <input name="correo" type="email" className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#cbd5e1' }}>Contraseña</label>
              <input name="password" type="password" className="glass-input" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="glass-button primary" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Creando...' : 'Crear Perfil'}
            </button>
          </form>
        </section>

        {/* Lista de Profesionales */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Profesionales Registrados
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Nombre</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>RUN</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Rol</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Estado</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesionales.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      {p.nombre} {p.isAdmin && <span style={{ fontSize: '0.7rem', background: 'rgba(96,165,250,0.2)', color: '#60a5fa', padding: '2px 6px', borderRadius: '10px', marginLeft: '8px' }}>Admin</span>}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{p.run || '-'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{p.rol}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        background: p.activo ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                        color: p.activo ? '#4ade80' : '#fca5a5'
                      }}>
                        {p.activo ? 'Activo' : 'Bloqueado'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {!p.isAdmin && (
                        <button 
                          onClick={() => handleToggle(p.id, p.activo)}
                          className="glass-button" 
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '0.75rem',
                            color: p.activo ? '#fca5a5' : '#4ade80',
                            border: `1px solid ${p.activo ? 'rgba(248, 113, 113, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`
                          }}
                        >
                          {p.activo ? 'Bloquear' : 'Desbloquear'}
                        </button>
                      )}
                      {user.id === p.id && (
                        <button 
                          onClick={async () => {
                            const nuevaPass = prompt('Ingresa tu nueva contraseña (mínimo 6 caracteres):');
                            if (nuevaPass && nuevaPass.length >= 6) {
                              const { changePasswordAction } = await import('@/app/actions/admin');
                              const res = await changePasswordAction(p.id, nuevaPass);
                              if (res.success) alert('Contraseña actualizada correctamente.');
                              else alert(res.error);
                            } else if (nuevaPass) {
                              alert('La contraseña debe tener al menos 6 caracteres.');
                            }
                          }}
                          className="glass-button" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.3)' }}
                        >
                          Cambiar mi contraseña
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
