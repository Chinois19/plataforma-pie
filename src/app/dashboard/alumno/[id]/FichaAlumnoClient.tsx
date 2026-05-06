'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GanttCalendar from '@/components/GanttCalendar';
import toast from 'react-hot-toast';

interface FichaAlumnoClientProps {
  alumno: any;
  initialHistorial: any[];
  createMaterialAction: (formData: FormData) => Promise<any>;
  user: any;
}

export default function FichaAlumnoClient({ alumno, initialHistorial, createMaterialAction, user }: FichaAlumnoClientProps) {
  const router = useRouter();
  const [historial, setHistorial] = useState(initialHistorial);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatTimeInUse = (fechaApertura: string | null) => {
    if (!fechaApertura) return 'Sin abrir';
    const diffMs = new Date().getTime() - new Date(fechaApertura).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `Hace ${diffMins} min.`;
    if (diffHrs < 24) return `Hace ${diffHrs} h.`;
    return `Hace ${diffDays} días`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const handleDarDeAlta = () => {
    if (confirm('¿Estás seguro de dar de alta a este alumno de la modalidad a distancia? Ya no aparecerá en tu lista.')) {
      const dadosDeAlta = JSON.parse(localStorage.getItem('alumnosDadosDeAlta') || '[]');
      if (!dadosDeAlta.includes(alumno.id.toString())) {
        dadosDeAlta.push(alumno.id.toString());
        localStorage.setItem('alumnosDadosDeAlta', JSON.stringify(dadosDeAlta));
      }
      router.push('/dashboard');
    }
  };

  const filteredHistorial = historial.filter(item => 
    item.actividad.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.asignatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.profesor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Navbar */}
      <header className="glass-panel" style={{ width: '100%', maxWidth: '1000px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Ficha Integral del Alumno</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Escuela Pucara Alto</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleDarDeAlta} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem', backgroundColor: 'rgba(248, 113, 113, 0.2)', color: '#fca5a5', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
            Dar de alta de modalidad a distancia
          </button>
          <Link href="/dashboard" className="glass-button" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            Volver al Panel
          </Link>
        </div>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Sección: Antecedentes */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Antecedentes del Estudiante</h3>
            <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>Modificar</button>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Foto / Ícono del Alumno */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid rgba(96, 165, 250, 0.5)' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={alumno.sexo === 'Niña' ? '#f472b6' : '#60a5fa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>

            {/* Datos */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Nombre Completo</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.nombre}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>RUT</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.rut}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Curso y Diagnóstico</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.curso} - {alumno.diagnostico}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Sexo</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.sexo || 'No especificado'}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Fecha de Nacimiento</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.fechaNacimiento || 'No especificada'}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Adulto a Cargo</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.apoderado}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#60a5fa' }}>Teléfono (Prioridad 1)</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.telefono}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Correo Electrónico</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>{alumno.correo}</p>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1rem', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem' }}>Enlace de Acceso Familiar (Único)</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${alumno.token || alumno.id}`} 
                  className="glass-input" 
                  style={{ flex: 1, padding: '6px 12px', fontSize: '0.875rem', color: 'var(--foreground)', background: 'var(--glass-bg-subtle)' }} 
                />
                <button 
                  type="button" 
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portal/${alumno.token || alumno.id}`); alert('Enlace copiado'); }} 
                  className="glass-button" 
                  style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                >
                  Copiar
                </button>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Sección: Cargar Material */}
        <section className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Cargar Material Educativo
          </h3>
          <form action={async (formData) => {
            setIsUploading(true);
            formData.append('studentId', alumno.id.toString());
            try {
              const res = await createMaterialAction(formData);
              if (res.success) {
                setUploadSuccess(true);
                toast.success('¡Material subido con éxito!');
                
                // Add to local state for immediate feedback
                const newMaterial = {
                  id: res.materialId,
                  actividad: formData.get('actividad'),
                  asignatura: formData.get('asignatura'),
                  profesor: user.nombre, // Using current user's name
                  inicio: formData.get('fecha_inicio'),
                  termino: formData.get('fecha_termino'),
                  estado: 'Pendiente',
                  link: formData.get('link_drive') || '#',
                  fecha_apertura: null,
                  professionalId: user.id
                };
                setHistorial(prev => [newMaterial, ...prev]);
                
                // Forzar actualización suave del historial (server side)
                router.refresh();
              } else {
                toast.error(res.error || 'Error al subir material');
              }
            } catch (err) {
              console.error(err);
              toast.error('Error de conexión con el servidor. Intente nuevamente.');
            } finally {
              setIsUploading(false);
            }
          }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Definición de la Actividad</label>
              <input type="text" name="actividad" className="glass-input" placeholder="Ej. Guía práctica de sumas y restas" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Asignatura</label>
              <select name="asignatura" className="glass-input" required style={{ width: '100%', appearance: 'none', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <option value="" style={{ color: '#000' }}>Seleccione una categoría...</option>
                <option value="Lenguaje y Comunicación" style={{ color: '#000' }}>Lenguaje y Comunicación</option>
                <option value="Matemática" style={{ color: '#000' }}>Matemática</option>
                <option value="Ciencias Naturales" style={{ color: '#000' }}>Ciencias Naturales</option>
                <option value="Historia, Geografía y Ciencias Sociales" style={{ color: '#000' }}>Historia, Geografía y Ciencias Sociales</option>
                <option value="Inglés" style={{ color: '#000' }}>Inglés</option>
                <option value="Educación Física y Salud" style={{ color: '#000' }}>Educación Física y Salud</option>
                <option value="Artes Visuales" style={{ color: '#000' }}>Artes Visuales</option>
                <option value="Música" style={{ color: '#000' }}>Música</option>
                <option value="Tecnología" style={{ color: '#000' }}>Tecnología</option>
                <option value="Orientación" style={{ color: '#000' }}>Orientación</option>
                <option value="Religión" style={{ color: '#000' }}>Religión</option>
                <option value="Equipo PIE" style={{ color: '#000', fontWeight: 'bold' }}>Equipo PIE</option>
              </select>
            </div>
            {/* El profesor se infiere del usuario conectado */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Objetivos a trabajar</label>
              <textarea name="objetivos" className="glass-input" placeholder="Ej. Reforzar el cálculo mental..." rows={2} required></textarea>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Recomendaciones para el uso en el hogar</label>
              <textarea name="recomendaciones" className="glass-input" placeholder="Ej. Acompañar al niño en un lugar sin ruido..." rows={2}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fecha de Carga (Hoy/Ayer)</label>
              <input type="date" name="fecha_carga" className="glass-input" defaultValue={todayStr} min={yesterdayStr} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Enlace de Material Externo</label>
              <input type="url" name="link_drive" className="glass-input" placeholder="https://docs.google.com/..." required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fecha de Inicio</label>
              <input type="date" name="fecha_inicio" className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fecha de Término</label>
              <input type="date" name="fecha_termino" className="glass-input" required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" disabled={isUploading} className="glass-button primary" style={{ padding: '10px 24px', opacity: isUploading ? 0.7 : 1 }}>
                {isUploading ? 'Procesando...' : 'Subir y Notificar a Apoderado'}
              </button>
            </div>
          </form>
          {uploadSuccess && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(74, 222, 128, 0.5)', backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }}></span>
                ¡Material subido con éxito!
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#cbd5e1' }}>Comparte este enlace único con el apoderado para que acceda al material:</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${alumno.token || alumno.id}`} className="glass-input" style={{ flex: 1, padding: '8px 12px', fontSize: '0.875rem', color: 'var(--foreground)' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portal/${alumno.token || alumno.id}`); alert('Enlace copiado al portapapeles'); }} className="glass-button primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Copiar Link</button>
              </div>
            </div>
          )}
        </section>

        {/* Calendario Gantt Dinámico */}
        <GanttCalendar materiales={historial} />

        {/* Sección: Parrilla de Historial / Auditoría */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
              Auditoría de Material (Historial)
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Buscar material..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.875rem', minWidth: '200px' }}
              />
              <button className="glass-button primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                Buscar
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Actividad</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Asignatura</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Profesor(a)</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Fecha Inicio/Fin</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Tiempo en Uso</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Estado</th>
                  <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 'normal', fontSize: '0.875rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistorial.map((row: any) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{row.actividad}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{row.asignatura}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{row.profesor}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{row.inicio} / {row.termino}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                        {(() => {
                          const seconds = row.tiempo_total_segundos || 0;
                          if (seconds < 60) return `${seconds} seg.`;
                          const mins = Math.floor(seconds / 60);
                          if (mins < 60) return `${mins} min.`;
                          const hrs = Math.floor(mins / 60);
                          const rem = mins % 60;
                          return `${hrs}h ${rem}m`;
                        })()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {(() => {
                        const [d, m, y] = row.termino.split('-').map(Number);
                        const deadlineDate = new Date(y, m - 1, d);
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        
                        let bgColor = 'rgba(74, 222, 128, 0.2)';
                        let textColor = '#4ade80';
                        let label = row.estado;

                        if (row.estado !== 'Completado') {
                          if (diffDays < 0) {
                            bgColor = 'rgba(248, 113, 113, 0.2)';
                            textColor = '#f87171';
                            label = 'Atrasado';
                          } else if (diffDays <= 3) {
                            bgColor = 'rgba(250, 204, 21, 0.2)';
                            textColor = '#facc15';
                            label = 'Próximo';
                          }
                        }

                        return (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem',
                            background: bgColor,
                            color: textColor,
                            fontWeight: 'bold'
                          }}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {row.link !== '#' ? (
                        <a href={row.link} target="_blank" className="glass-button" style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-block' }}>
                          Abrir Link
                        </a>
                      ) : row.archivoUrl ? (
                        <a href={row.archivoUrl} target="_blank" className="glass-button" style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-block' }}>
                          Abrir Archivo
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sin material</span>
                      )}
                      {(user.isAdmin || user.id === row.professionalId) && (
                        <button 
                          className="glass-button" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'rgba(248, 113, 113, 0.2)', color: '#fca5a5', border: '1px solid rgba(248, 113, 113, 0.3)' }} 
                          onClick={async () => {
                            if (confirm('¿Estás seguro de eliminar este material?')) {
                              const { deleteMaterialAction } = await import('@/app/actions/material');
                              const res = await deleteMaterialAction(row.id);
                              if (res.success) {
                                toast.success('Material eliminado');
                                setHistorial(prev => prev.filter((m: any) => m.id !== row.id));
                                router.refresh();
                              } else {
                                toast.error(res.error || 'Error al eliminar');
                              }
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredHistorial.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      No se encontraron materiales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
