import { getAlumnos, getAuditoriaGlobal } from '@/app/actions/queries';
import DashboardClient from './DashboardClient';
import { getCurrentUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const [alumnos, auditoria] = await Promise.all([
    getAlumnos(),
    getAuditoriaGlobal()
  ]);

  return (
    <DashboardClient 
      initialAlumnos={alumnos} 
      initialAuditoria={auditoria} 
      user={user} 
    />
  );
}
