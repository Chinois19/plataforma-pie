const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@pucaraalto.cl';
  
  const existingAdmin = await prisma.professional.findUnique({
    where: { correo: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.professional.create({
      data: {
        nombre: 'Administrador General',
        rol: 'Administrador',
        correo: adminEmail,
        password: 'admin', // Simple password for demo
        isAdmin: true,
        activo: true
      }
    });
    console.log('Admin user created: admin@pucaraalto.cl / admin');
  } else {
    // Ensure existing user is admin
    await prisma.professional.update({
      where: { correo: adminEmail },
      data: { isAdmin: true }
    });
    console.log('Admin user updated to ensure isAdmin is true.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
