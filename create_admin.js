const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
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
  console.log('Usuario admin creado exitosamente.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
