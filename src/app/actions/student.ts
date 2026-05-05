'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';

export async function createStudentAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const rut = formData.get('rut') as string;
  const curso = formData.get('curso') as string;
  const diagnostico = formData.get('diagnostico') as string;
  const apoderado = formData.get('apoderado') as string;
  const telefono = formData.get('telefono') as string;
  const correo = formData.get('correo') as string;
  const sexo = formData.get('sexo') as string;
  const fechaNacimiento = formData.get('fechaNacimiento') as string;
  const foto = formData.get('foto') as File;

  let fotoUrl = null;
  if (foto && foto.size > 0) {
    const fileName = `foto_${Date.now()}-${foto.name.replace(/\s+/g, '_')}`;
    const blob = await put(fileName, foto, {
      access: 'public',
    });
    fotoUrl = blob.url;
  }

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
        sexo: sexo || 'No especificado',
        fechaNacimiento,
        fotoUrl
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

export async function uploadStudentPhotoAction(formData: FormData) {
  const studentIdStr = formData.get('studentId') as string;
  const foto = formData.get('foto') as File;

  if (!studentIdStr || !foto || foto.size === 0) return { success: false, error: 'No se subió ninguna imagen' };

  try {
    const fileName = `foto_${studentIdStr}_${Date.now()}-${foto.name.replace(/\s+/g, '_')}`;
    const blob = await put(fileName, foto, {
      access: 'public',
    });

    await prisma.student.update({
      where: { id: parseInt(studentIdStr) },
      data: { fotoUrl: blob.url }
    });

    return { success: true };
  } catch (error) {
    console.error('Error subiendo foto:', error);
    return { success: false, error: 'Error al subir la fotografía' };
  }
}
