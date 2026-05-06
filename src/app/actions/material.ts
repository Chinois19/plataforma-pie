'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth';

export async function createMaterialAction(formData: FormData) {
  try {
    const actividad = formData.get('actividad') as string;
    const asignatura = formData.get('asignatura') as string;
    const profesor = formData.get('profesor') as string;
    const objetivos = formData.get('objetivos') as string;
    const recomendaciones = formData.get('recomendaciones') as string;
    const fecha_inicio = formData.get('fecha_inicio') as string;
    const fecha_termino = formData.get('fecha_termino') as string;
    const studentParamId = formData.get('studentId') as string;
    const fecha_carga_raw = formData.get('fecha_carga') as string;
    const fecha_carga = formatDate(fecha_carga_raw) || new Date().toLocaleDateString('es-CL');
...
    // Crear el registro de material
    const material = await prisma.material.create({
      data: {
        actividad,
        asignatura,
        objetivos,
        recomendaciones: recomendaciones || '',
        fecha_carga: fecha_carga,
        fecha_inicio: formatDate(fecha_inicio),
        fecha_termino: formatDate(fecha_termino),
        estado: 'Pendiente',
        acceso: 'Sin acceso',
        link: link_drive || null,
        professionalId: user.id,
        studentId: studentIdInt
      }
    });

    revalidatePath(`/dashboard/alumno/${studentParamId}`);
    return { success: true, materialId: material.id };

  } catch (error: any) {
    console.error('DETALLE ERROR CREAR MATERIAL:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return { success: false, error: 'Hubo un error al guardar el material educativo.' };
  }
}

export async function markMaterialAsAccessedAction(materialId: number) {
  try {
    const material = await prisma.material.findUnique({ where: { id: materialId } });
    if (!material) return { success: false };

    // Solo actualizamos la fecha de apertura si no se ha abierto antes
    const dataToUpdate: any = {
      acceso: 'Accedido',
      estado: 'En Curso'
    };

    if (!material.fecha_apertura) {
      dataToUpdate.fecha_apertura = new Date();
    }

    await prisma.material.update({
      where: { id: materialId },
      data: dataToUpdate
    });
    return { success: true };
  } catch (error) {
    console.error('Error al marcar acceso:', error);
    return { success: false };
  }
}

export async function deleteMaterialAction(materialId: number) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'No autorizado' };

    const material = await prisma.material.findUnique({ where: { id: materialId } });
    if (!material) return { success: false, error: 'Material no encontrado' };

    if (!user.isAdmin && material.professionalId !== user.id) {
      return { success: false, error: 'No autorizado para eliminar este material' };
    }

    await prisma.material.delete({ where: { id: materialId } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar material' };
  }
}
