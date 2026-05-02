const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const students = await prisma.student.findMany();
    console.log('STUDENTS_START');
    console.log(JSON.stringify(students, null, 2));
    console.log('STUDENTS_END');
  } catch (e) {
    console.error('DB_ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
