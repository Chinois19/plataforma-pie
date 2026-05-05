import Link from 'next/link';
import { getAlumnoById, getMaterialesPorAlumno } from '@/app/actions/queries';
import { createMaterialAction } from '@/app/actions/material';
import FichaAlumnoClient from './FichaAlumnoClient';
import { getCurrentUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function FichaAlumnoPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  const [alumno, historial] = await Promise.all([
    getAlumnoById(id),
    getMaterialesPorAlumno(id)
  ]);

  if (!alumno) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#fca5a5' }}>Error: Alumno no encontrado</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>El alumno con ID {resolvedParams.id} no existe o fue eliminado.</p>
          <Link href="/dashboard" className="glass-button primary" style={{ textDecoration: 'none' }}>Volver al Panel</Link>
        </div>
      </div>
    );
  }

  return (
    <FichaAlumnoClient 
      alumno={alumno} 
      initialHistorial={historial} 
      createMaterialAction={createMaterialAction} 
      user={user}
    />
  );
}
