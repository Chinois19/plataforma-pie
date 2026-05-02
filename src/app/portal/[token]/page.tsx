import { getAlumnoById, getMaterialesPorAlumno } from '@/app/actions/queries';
import PortalClient from './PortalClient';
import Link from 'next/link';

export default async function PortalAlumnoPage({ params }: { params: Promise<{ token: string }> | { token: string } }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.token);

  // Fetch real data from DB
  const [alumno, materiales] = await Promise.all([
    getAlumnoById(id),
    getMaterialesPorAlumno(id)
  ]);

  if (!alumno) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#fca5a5' }}>Portal Familiar: Error</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>El enlace no es válido o el alumno no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <PortalClient 
      alumno={alumno} 
      materiales={materiales} 
    />
  );
}
