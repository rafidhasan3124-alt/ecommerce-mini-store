import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all data dependent on users...');
  
  // Delete in order to respect foreign key constraints
  await prisma.address.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  
  console.log('Deleting all users...');
  const result = await prisma.user.deleteMany();
  
  console.log(`Successfully deleted ${result.count} users.`);
}

main()
  .catch((e) => {
    console.error('Error deleting users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
