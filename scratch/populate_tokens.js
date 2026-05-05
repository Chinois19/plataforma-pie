const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({
    where: { token: null }
  });

  console.log(`Found ${students.length} students without tokens.`);

  for (const student of students) {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase(); // Simple 8 char token
    await prisma.student.update({
      where: { id: student.id },
      data: { token }
    });
    console.log(`Updated student ${student.nombre} with token ${token}`);
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
