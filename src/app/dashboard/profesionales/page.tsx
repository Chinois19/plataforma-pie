import { getCurrentUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfesionalesClient from './ProfesionalesClient';

export default async function ProfesionalesPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    redirect('/dashboard');
  }

  const profesionales = await prisma.professional.findMany({
    orderBy: { nombre: 'asc' }
  });

  return (
    <ProfesionalesClient user={user} initialProfesionales={profesionales} />
  );
}
