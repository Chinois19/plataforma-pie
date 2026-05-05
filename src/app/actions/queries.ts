'use server';

import { prisma } from '@/lib/prisma';

export async function getAlumnos() {
  try {
    const alumnos = await prisma.student.findMany();
    return alumnos;
  } catch (error: any) {
    console.error("DETALLE ERROR ALUMNOS:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return [];
  }
}

export async function getAlumnoById(id: number) {
  try {
    return await prisma.student.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Error fetching alumno by ID:", error);
    return null;
  }
}

export async function getAlumnoByToken(token: string) {
  try {
    return await prisma.student.findUnique({
      where: { token }
    });
  } catch (error) {
    console.error("Error fetching alumno by token:", error);
    return null;
  }
}

export async function getMaterialesPorAlumno(studentId: number) {
  try {
    const materials = await prisma.material.findMany({
      where: { studentId },
      include: { professional: true },
      orderBy: { id: 'desc' }
    });

    return materials.map(m => ({
      id: m.id,
      actividad: m.actividad,
      asignatura: m.asignatura,
      profesor: m.professional.nombre,
      inicio: m.fecha_inicio,
      termino: m.fecha_termino,
      carga: m.fecha_carga,
      acceso: m.acceso,
      estado: m.estado,
      link: m.link || '#',
      archivoUrl: m.archivoUrl,
      professionalId: m.professionalId,
      fecha_apertura: m.fecha_apertura
    }));
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
}

export async function getAuditoriaGlobal() {
  try {
    const materials = await prisma.material.findMany({
      include: { professional: true, student: true },
      orderBy: { id: 'desc' },
      take: 10
    });

    return materials.map(m => ({
      id: m.id,
      profesional: `${m.professional.nombre}`,
      accion: 'subió',
      archivo: m.actividad,
      alumno: m.student.nombre,
      tiempo: `Subido el ${m.fecha_carga}` 
    }));
  } catch (error) {
    console.error("Error fetching global audit:", error);
    return [];
  }
}
