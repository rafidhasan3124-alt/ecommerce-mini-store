import { PrismaClient } from '@prisma/client';
import { mockProducts } from '../src/data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stripePriceId: product.stripePriceId,
        category: product.category,
        inStock: product.inStock,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });