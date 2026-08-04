import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  // Headphones
  {
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise canceling. Premium sound. All day comfort with 30-hour battery life.',
    price: 29900,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_sony_xm5',
    category: 'Headphones',
    inStock: true,
    stockQuantity: 150,
  },
  {
    title: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Personalized Spatial Audio, and MagSafe Charging Case.',
    price: 24900,
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_airpods',
    category: 'Headphones',
    inStock: true,
    stockQuantity: 300,
  },
  
  // Smartphones
  {
    title: 'iPhone 15 Pro Max - 256GB Titanium',
    description: 'Forged in titanium. A17 Pro chip. 48MP Main camera. USB-C.',
    price: 119900,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_iphone15',
    category: 'Smartphones',
    inStock: true,
    stockQuantity: 50,
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Welcome to the era of mobile AI. 200MP camera.',
    price: 129900,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_s24',
    category: 'Smartphones',
    inStock: true,
    stockQuantity: 75,
  },
  
  // Laptops
  {
    title: 'MacBook Air M3 - 15 inch',
    description: 'Supercharged by M3. 18 hours of battery life. Liquid Retina display.',
    price: 129900,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_macbook',
    category: 'Laptops',
    inStock: true,
    stockQuantity: 40,
  },
  {
    title: 'Dell XPS 15 OLED',
    description: 'Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4070.',
    price: 199900,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_xps',
    category: 'Laptops',
    inStock: true,
    stockQuantity: 25,
  },
  
  // Smart Watches
  {
    title: 'Apple Watch Series 9',
    description: 'Smarter. Brighter. Mightier. Double tap gesture. Carbon neutral.',
    price: 39900,
    imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_watch9',
    category: 'Smart Watch',
    inStock: true,
    stockQuantity: 120,
  },
  {
    title: 'Garmin Fenix 7X Pro',
    description: 'Ultimate multisport GPS smartwatch with solar charging.',
    price: 89900,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_garmin',
    category: 'Smart Watch',
    inStock: true,
    stockQuantity: 15,
  },

  // Gaming
  {
    title: 'Sony PlayStation 5 Console',
    description: 'Lightning speed, breathtaking immersion, stunning games.',
    price: 49900,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_ps5',
    category: 'Gaming',
    inStock: true,
    stockQuantity: 0,
  },
  {
    title: 'Xbox Series X',
    description: 'The fastest, most powerful Xbox ever. 4K gaming at up to 120 FPS.',
    price: 49900,
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_xbox',
    category: 'Gaming',
    inStock: true,
    stockQuantity: 10,
  },
  {
    title: 'Nintendo Switch OLED Model',
    description: '7-inch OLED screen, wide adjustable stand, built-in wired LAN port.',
    price: 34900,
    imageUrl: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_switch',
    category: 'Gaming',
    inStock: true,
    stockQuantity: 45,
  },

  // Speakers
  {
    title: 'JBL Charge 5 Portable Speaker',
    description: 'Waterproof portable Bluetooth speaker with built-in powerbank.',
    price: 14900,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_jbl',
    category: 'Speakers',
    inStock: true,
    stockQuantity: 200,
  },
  {
    title: 'Sonos Era 300',
    description: 'Breakthrough spatial audio speaker. Dolby Atmos supported.',
    price: 44900,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_sonos',
    category: 'Speakers',
    inStock: true,
    stockQuantity: 30,
  },

  // Cameras
  {
    title: 'Sony Alpha a7 IV Mirrorless Camera',
    description: '33MP Full-Frame sensor, 4K 60p video, Real-time Eye AF.',
    price: 249900,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_a7iv',
    category: 'Cameras',
    inStock: true,
    stockQuantity: 12,
  },
  {
    title: 'GoPro HERO12 Black',
    description: 'Waterproof action camera, 5.3K60 Ultra HD video, HyperSmooth 6.0.',
    price: 39900,
    imageUrl: 'https://images.unsplash.com/photo-1565964528148-5221dc6de952?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_gopro',
    category: 'Cameras',
    inStock: true,
    stockQuantity: 80,
  },

  // Tablets
  {
    title: 'iPad Pro 12.9-inch (M2)',
    description: 'Ultimate iPad experience with the most advanced display.',
    price: 109900,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_ipad',
    category: 'Tablets',
    inStock: true,
    stockQuantity: 60,
  },
  {
    title: 'Samsung Galaxy Tab S9 Ultra',
    description: '14.6" Dynamic AMOLED 2X display, S Pen included, IP68 water resistant.',
    price: 119900,
    imageUrl: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=800&auto=format&fit=crop',
    stripePriceId: 'price_mock_tabs9',
    category: 'Tablets',
    inStock: true,
    stockQuantity: 35,
  }
];

async function seed() {
  console.log('Clearing existing products...');
  await prisma.product.deleteMany({});
  
  console.log('Seeding new premium products...');
  
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
