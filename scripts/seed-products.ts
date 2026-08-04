import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 19999,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stripePriceId: 'price_1Tx3y3L4Re7ehxRnFP88TSPn',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 50,
  },
  {
    title: 'Minimalist Backpack',
    description: 'Water-resistant, lightweight backpack with laptop sleeve and multiple compartments.',
    price: 5999,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stripePriceId: 'price_1Tx4EML4Re7ehxRnpO4hPGpN',
    category: 'Accessories',
    inStock: true,
    stockQuantity: 30,
  },
  {
    title: 'Smart Fitness Tracker',
    description: 'Track your steps, heart rate, and sleep patterns with this sleek fitness band.',
    price: 7999,
    imageUrl: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500',
    stripePriceId: 'price_1Tx4G7L4Re7ehxRnh1kG41HS',
    category: 'Electronics',
    inStock: false,
    stockQuantity: 0,
  },
  {
    title: 'Eco-Friendly Water Bottle',
    description: 'Insulated stainless steel bottle that keeps drinks cold for 24 hours.',
    price: 2999,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    stripePriceId: 'price_1Tx4HVL4Re7ehxRn9YGYiV2I',
    category: 'Lifestyle',
    inStock: true,
    stockQuantity: 100,
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches and anti-ghosting technology.',
    price: 12999,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
    stripePriceId: 'price_mock_keyboard',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 25,
  },
  {
    title: 'Leather Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking technology.',
    price: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    stripePriceId: 'price_mock_wallet',
    category: 'Accessories',
    inStock: true,
    stockQuantity: 60,
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: '360-degree surround sound speaker with 12-hour playtime and waterproof design.',
    price: 8999,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stripePriceId: 'price_mock_speaker',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 40,
  },
  {
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs perfect for your morning coffee ritual.',
    price: 3999,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    stripePriceId: 'price_mock_mugs',
    category: 'Lifestyle',
    inStock: true,
    stockQuantity: 80,
  },
];

async function seed() {
  console.log('Seeding products...');
  
  // Check if products already exist
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} products. Skipping seed.`);
    return;
  }

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✓ Created: ${product.title}`);
  }

  console.log(`\n✅ Successfully seeded ${products.length} products!`);
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
