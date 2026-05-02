'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStudentAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const rut = formData.get('rut') as string;
  const curso = formData.get('curso') as string;
  const diagnostico = formData.get('diagnostico') as string;
  const apoderado = formData.get('apoderado') as string;
  const telefono = formData.get('telefono') as string;
  const correo = formData.get('correo') as string;

  try {
    await prisma.student.create({
      data: {
        nombre,
        rut,
        curso,
        diagnostico,
        apoderado,
        telefono,
        correo: correo || '',
      }
    });
  } catch (error: any) {
    console.error('DETALLE ERROR CREAR ALUMNO:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return { success: false, error: 'Hubo un error al guardar el alumno o el RUT ya existe.' };
  }

  // Refrescar el panel principal para mostrar el nuevo alumno
  revalidatePath('/dashboard');
  
  // Redirigir al dashboard
  redirect('/dashboard');
}
