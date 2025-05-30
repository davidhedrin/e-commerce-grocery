import { AuthProviderEnum, Prisma, PrismaClient, RolesEnum } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "ProductCategory" RESTART IDENTITY CASCADE;`);
  
    await tx.productCategory.createMany({
      data: [
        { 
          slug: "fresh-produce",
          name: "Fresh Produce",
          desc: "Fruits, vegetables, and herbs that are fresh and seasonal.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "meat-seafood",
          name: "Meat & Seafood",
          desc: "Raw or packaged fresh and frozen meat, poultry, and seafood.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "dairy-eggs",
          name: "Dairy & Eggs",
          desc: "Milk, cheese, butter, yogurt, and eggs from various brands.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "bakery",
          name: "Bakery",
          desc: "Freshly baked bread, pastries, and cakes.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "pantry-steples",
          name: "Pantry Staples",
          desc: "Non-perishable items and cooking essentials.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "frozen-foods",
          name: "Frozen Foods",
          desc: "Frozen ready-to-eat meals, vegetables, snacks, and desserts.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "snacks-bevs",
          name: "Snacks & Beverages",
          desc: "Chips, biscuits, candies, soft drinks, juices, and bottled water.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "hh-essent",
          name: "Household Essentials",
          desc: "Cleaning supplies, laundry products, paper goods.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "health-pcare",
          name: "Health & Personal Care",
          desc: "Basic health items and personal hygiene products.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "baby-kids",
          name: "Baby & Kids",
          desc: "Products for infants and children including food and hygiene items.",
          is_active: true,
          createdBy: "SEEDER"
        },
        { 
          slug: "pet-supps",
          name: "Pet Supplies",
          desc: "Food, treats, and basic grooming items for pets.",
          is_active: true,
          createdBy: "SEEDER"
        },
      ]
    });
  });
  console.log('Multiple Product Categories Created!');
}