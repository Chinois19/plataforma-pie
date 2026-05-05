'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function toggleProfessionalStatus(id: number, currentStatus: boolean) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return { success: false, error: 'No autorizado' };

  try {
    await prisma.professional.update({
      where: { id },
      data: { activo: !currentStatus }
    });
    revalidatePath('/dashboard/profesionales');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al actualizar el estado' };
  }
}

export async function createProfessional(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return { success: false, error: 'No autorizado' };

  const nombre = formData.get('nombre') as string;
  const run = formData.get('run') as string;
  const rol = formData.get('rol') as string;
  const correo = formData.get('correo') as string;
  const password = formData.get('password') as string;

  try {
    await prisma.professional.create({
      data: {
        nombre,
        run,
        rol,
        correo,
        password,
        isAdmin: false,
        activo: true
      }
    });
    revalidatePath('/dashboard/profesionales');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'El correo ya está registrado.' };
    }
    return { success: false, error: 'Error al crear el profesional.' };
  }
}

export async function changePasswordAction(id: number, newPassword: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'No autorizado' };
  
  if (user.id !== id && !user.isAdmin) return { success: false, error: 'No tienes permiso para cambiar esta contraseña' };

  try {
    await prisma.professional.update({
      where: { id },
      data: { password: newPassword }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al actualizar contraseña' };
  }
}
