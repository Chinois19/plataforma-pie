'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const correo = formData.get('correo') as string;
  const password = formData.get('password') as string;

  const user = await prisma.professional.findUnique({
    where: { correo }
  });

  if (!user || user.password !== password) {
    return { error: 'Credenciales inválidas' };
  }

  if (!user.activo) {
    return { error: 'Su cuenta ha sido desactivada por el administrador.' };
  }

  // Set cookies for simple auth
  const cookieStore = await cookies();
  cookieStore.set('userId', user.id.toString(), { path: '/' });
  cookieStore.set('userRole', user.isAdmin ? 'ADMIN' : 'PROFESIONAL', { path: '/' });
  
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('userRole');
  redirect('/login');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('userId')?.value;
  
  if (!userIdStr) return null;
  
  const id = parseInt(userIdStr);
  if (isNaN(id)) return null;

  try {
    const user = await prisma.professional.findUnique({
      where: { id }
    });
    
    if (!user || !user.activo) return null;
    return user;
  } catch (e) {
    return null;
  }
}
