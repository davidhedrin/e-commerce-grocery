import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import usersSeeder from "./seed/user-seeder";
import productCategorySeeder from "./seed/product-category-seeder";

async function main(){
  await usersSeeder(prisma);
  await productCategorySeeder(prisma);

  console.log('Seeding finished.');
};

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});