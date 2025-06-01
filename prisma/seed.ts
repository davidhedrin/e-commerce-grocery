import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import usersSeeder from "./seed/user-seeder";
import productCategorySeeder from "./seed/product-category-seeder";
import productSeeder from "./seed/product-seeder";
import productVariantSeeder from "./seed/product-variant-seeder";

async function main(){
  await usersSeeder(prisma);
  await productCategorySeeder(prisma);
  await productSeeder(prisma);
  await productVariantSeeder(prisma);

  console.log('Seeding finished.');
};

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});