'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
    const archivo = formData.get('archivo') as File;

    const studentIdInt = parseInt(studentParamId);
    let archivoUrl = '';

    // Lógica para guardar el archivo físicamente
    if (archivo && archivo.size > 0) {
      const fs = require('fs');
      const path = require('path');
      
      const bytes = await archivo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Nombre de archivo seguro (evitar caracteres extraños y colisiones)
      const fileName = `${Date.now()}-${archivo.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      archivoUrl = `/uploads/${fileName}`;
    }

    // Garantizamos que exista un profesional genérico para esta demo
    const professional = await prisma.professional.upsert({
      where: { correo: 'equipo@pie.cl' },
      update: { nombre: profesor },
      create: { 
        nombre: profesor, 
        rol: 'Docente PIE', 
        correo: 'equipo@pie.cl', 
        password: 'password123' 
      }
    });

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      if (!dateStr.includes('-')) return dateStr;
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    };

    // Crear el registro de material
    const material = await prisma.material.create({
      data: {
        actividad,
        asignatura,
        objetivos,
        recomendaciones: recomendaciones || '',
        fecha_carga: new Date().toLocaleDateString('es-CL'),
        fecha_inicio: formatDate(fecha_inicio),
        fecha_termino: formatDate(fecha_termino),
        estado: 'Pendiente',
        acceso: 'Sin acceso',
        archivoUrl: archivoUrl,
        professionalId: professional.id,
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
    await prisma.material.update({
      where: { id: materialId },
      data: {
        acceso: 'Accedido',
        estado: 'Visto por Familia'
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error al marcar acceso:', error);
    return { success: false };
  }
}
