import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.professional.upsert({
      where: { correo: 'admin' },
      update: { password: 'admin', isAdmin: true, activo: true, nombre: 'Administrador', rol: 'Administrador' },
      create: {
        correo: 'admin',
        password: 'admin',
        nombre: 'Administrador',
        rol: 'Administrador',
        isAdmin: true,
        activo: true
      }
    });
    return NextResponse.json({ message: 'Admin user created or updated successfully!' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
