import { getAlumnoById, getAlumnoByToken, getMaterialesPorAlumno } from '@/app/actions/queries';
import PortalClient from './PortalClient';
import Link from 'next/link';

export default async function PortalAlumnoPage({ params }: { params: Promise<{ token: string }> | { token: string } }) {
  const resolvedParams = await params;
  const token = resolvedParams.token;

  // 1. Fetch student by token (or ID as fallback)
  let alumno = await getAlumnoByToken(token);

  // Fallback: if not found by token, try to find by ID if token is numeric
  if (!alumno && /^\d+$/.test(token)) {
    alumno = await getAlumnoById(parseInt(token));
  }

  if (!alumno) {
    // Demo mode or Error
    if (token === 'demo-token' || token === 'DEMO-2024') {
      return (
        <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#60a5fa' }}>Modo Demostración</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Este es el portal que verán los apoderados. En el panel real, podrás ver el material cargado por los docentes.</p>
            <Link href="/" className="glass-button primary">Volver al Inicio</Link>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#fca5a5' }}>Portal Familiar: Error</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>El enlace no es válido o el alumno no existe.</p>
          <Link href="/" className="glass-button">Ir al Inicio</Link>
        </div>
      </div>
    );
  }

  // 2. Fetch materials using the real ID from the found student
  const materiales = await getMaterialesPorAlumno(alumno.id);

  return (
    <PortalClient 
      alumno={alumno} 
      materiales={materiales} 
    />
  );
}
