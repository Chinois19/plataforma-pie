'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createStudentAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const rut = formData.get('rut') as string;
  const curso = formData.get('curso') as string;
  const diagnostico = formData.get('diagnostico') as string;
  const apoderado = formData.get('apoderado') as string;
  const telefono = formData.get('telefono') as string;
  const direccion = formData.get('direccion') as string;
  const parentesco = formData.get('parentesco') as string;
  const correo = formData.get('correo') as string;
  const sexo = formData.get('sexo') as string;
  const fechaNacimiento = formData.get('fechaNacimiento') as string;

  try {
    await prisma.student.create({
      data: {
        nombre,
        rut,
        curso,
        diagnostico,
        apoderado,
        direccion,
        parentesco,
        telefono,
        correo: correo || '',
        sexo: sexo || 'No especificado',
        fechaNacimiento
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
  
  return { success: true };
}

