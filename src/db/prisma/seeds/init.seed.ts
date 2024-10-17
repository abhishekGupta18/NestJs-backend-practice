import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add seeds here
  // Make sure to use only in development mode,
  // In production we will use migrations for everything
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
