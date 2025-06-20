import { AuthProviderEnum, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "ProductVariant" RESTART IDENTITY CASCADE;`);
  
    await tx.productVariant.createMany({
      data: [
        {
          product_id: 1,
          sku: "GR-APL-GRN-001",
          barcode: "1000000000011",
          name: "1kg",
          price: 30000,
          disc_price: 27000,
          stock_qty: 50,
          createdBy: "SEEDER"
        },
        {
          product_id: 1,
          sku: "GR-APL-GRN-002",
          barcode: "1000000000012",
          name: "500g",
          price: 16000,
          disc_price: 15000,
          stock_qty: 100,
          createdBy: "SEEDER"
        },

        {
          product_id: 2,
          sku: "RD-BLP-001",
          barcode: "1000000000021",
          name: "1pcs Pack",
          price: 12000,
          disc_price: 11000,
          stock_qty: 70,
          createdBy: "SEEDER"
        },
        {
          product_id: 2,
          sku: "RD-BLP-002",
          barcode: "1000000000022",
          name: "3pcs Pack",
          price: 33000,
          disc_price: 30000,
          stock_qty: 40,
          createdBy: "SEEDER"
        },

        {
          product_id: 3,
          sku: "FR-SLM-001",
          barcode: "1000000000031",
          name: "250g",
          price: 75000,
          disc_price: 70000,
          stock_qty: 30,
          createdBy: "SEEDER"
        },
        {
          product_id: 3,
          sku: "FR-SLM-002",
          barcode: "1000000000032",
          name: "500g",
          price: 140000,
          disc_price: 130000,
          stock_qty: 20,
          createdBy: "SEEDER"
        },

        {
          product_id: 4,
          sku: "CH-BRST-001",
          barcode: "1000000000041",
          name: "500g",
          price: 50000,
          disc_price: 47000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },
        {
          product_id: 4,
          sku: "CH-BRST-002",
          barcode: "1000000000042",
          name: "1kg",
          price: 95000,
          disc_price: 90000,
          stock_qty: 30,
          createdBy: "SEEDER"
        },

        {
          product_id: 5,
          sku: "COT-CHS-001",
          barcode: "1000000000051",
          name: "250g",
          price: 30000,
          disc_price: 28000,
          stock_qty: 40,
          createdBy: "SEEDER"
        },
        {
          product_id: 5,
          sku: "COT-CHS-002",
          barcode: "1000000000052",
          name: "500g",
          price: 55000,
          disc_price: 52000,
          stock_qty: 20,
          createdBy: "SEEDER"
        },

        {
          product_id: 6,
          sku: "FR-EGG-001",
          barcode: "1000000000061",
          name: "6pcs",
          price: 20000,
          disc_price: 18000,
          stock_qty: 100,
          createdBy: "SEEDER"
        },
        {
          product_id: 6,
          sku: "FR-EGG-002",
          barcode: "1000000000062",
          name: "12pcs",
          price: 38000,
          disc_price: 35000,
          stock_qty: 50,
          createdBy: "SEEDER"
        },

        {
          product_id: 7,
          sku: "WHT-BRD-001",
          barcode: "1000000000071",
          name: "Loaf",
          price: 25000,
          disc_price: 23000,
          stock_qty: 70,
          createdBy: "SEEDER"
        },
        {
          product_id: 7,
          sku: "WHT-BRD-002",
          barcode: "1000000000072",
          name: "Sliced",
          price: 27000,
          disc_price: 25000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },

        {
          product_id: 8,
          sku: "CH-CRS-001",
          barcode: "1000000000081",
          name: "1pcs Pack",
          price: 10000,
          disc_price: 9500,
          stock_qty: 120,
          createdBy: "SEEDER"
        },
        {
          product_id: 8,
          sku: "CH-CRS-002",
          barcode: "1000000000082",
          name: "3pcs Pack",
          price: 28000,
          disc_price: 26000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },

        {
          product_id: 9,
          sku: "FZ-VEG-001",
          barcode: "1000000000091",
          name: "500g",
          price: 18000,
          disc_price: 17000,
          stock_qty: 80,
          createdBy: "SEEDER"
        },
        {
          product_id: 9,
          sku: "FZ-VEG-002",
          barcode: "1000000000092",
          name: "1kg",
          price: 34000,
          disc_price: 32000,
          stock_qty: 40,
          createdBy: "SEEDER"
        },

        {
          product_id: 10,
          sku: "FR-FRY-001",
          barcode: "1000000000101",
          name: "500g",
          price: 15000,
          disc_price: 14000,
          stock_qty: 90,
          createdBy: "SEEDER"
        },
        {
          product_id: 10,
          sku: "FR-FRY-002",
          barcode: "1000000000102",
          name: "1kg",
          price: 28000,
          disc_price: 26000,
          stock_qty: 50,
          createdBy: "SEEDER"
        },

        {
          product_id: 11,
          sku: "CH-CKI-001",
          barcode: "1000000000111",
          name: "150g",
          price: 18000,
          disc_price: 16000,
          stock_qty: 90,
          createdBy: "SEEDER"
        },
        {
          product_id: 11,
          sku: "CH-CKI-002",
          barcode: "1000000000112",
          name: "300g",
          price: 32000,
          disc_price: 30000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },

        {
          product_id: 12,
          sku: "COL-SOD-001",
          barcode: "1000000000121",
          name: "330ml Can",
          price: 8000,
          disc_price: 7500,
          stock_qty: 200,
          createdBy: "SEEDER"
        },
        {
          product_id: 12,
          sku: "COL-SOD-002",
          barcode: "1000000000122",
          name: "1.5L Bottle",
          price: 15000,
          disc_price: 14000,
          stock_qty: 100,
          createdBy: "SEEDER"
        },

        {
          product_id: 13,
          sku: "CLN-ALL-001",
          barcode: "1000000000131",
          name: "500ml",
          price: 12000,
          disc_price: 11000,
          stock_qty: 80,
          createdBy: "SEEDER"
        },
        {
          product_id: 13,
          sku: "CLN-ALL-002",
          barcode: "1000000000132",
          name: "1L",
          price: 20000,
          disc_price: 19000,
          stock_qty: 50,
          createdBy: "SEEDER"
        },

        {
          product_id: 14,
          sku: "PPT-TWL-001",
          barcode: "1000000000141",
          name: "2 Rolls",
          price: 16000,
          disc_price: 15000,
          stock_qty: 100,
          createdBy: "SEEDER"
        },
        {
          product_id: 14,
          sku: "PPT-TWL-002",
          barcode: "1000000000142",
          name: "6 Rolls",
          price: 44000,
          disc_price: 42000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },

        {
          product_id: 15,
          sku: "VIT-C-001",
          barcode: "1000000000151",
          name: "30 Tabs",
          price: 25000,
          disc_price: 23000,
          stock_qty: 100,
          createdBy: "SEEDER"
        },
        {
          product_id: 15,
          sku: "VIT-C-002",
          barcode: "1000000000152",
          name: "60 Tabs",
          price: 45000,
          disc_price: 43000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },

        {
          product_id: 16,
          sku: "ALV-GEL-001",
          barcode: "1000000000161",
          name: "100ml",
          price: 20000,
          disc_price: 18000,
          stock_qty: 70,
          createdBy: "SEEDER"
        },
        {
          product_id: 16,
          sku: "ALV-GEL-002",
          barcode: "1000000000162",
          name: "250ml",
          price: 35000,
          disc_price: 32000,
          stock_qty: 40,
          createdBy: "SEEDER"
        },

        {
          product_id: 17,
          sku: "BBY-DPR-001",
          barcode: "1000000000171",
          name: "Small (20pcs)",
          price: 50000,
          disc_price: 47000,
          stock_qty: 80,
          createdBy: "SEEDER"
        },
        {
          product_id: 17,
          sku: "BBY-DPR-002",
          barcode: "1000000000172",
          name: "Large (20pcs)",
          price: 52000,
          disc_price: 49000,
          stock_qty: 70,
          createdBy: "SEEDER"
        },

        {
          product_id: 18,
          sku: "KID-TBR-001",
          barcode: "1000000000181",
          name: "Soft",
          price: 10000,
          disc_price: 9000,
          stock_qty: 90,
          createdBy: "SEEDER"
        },
        {
          product_id: 18,
          sku: "KID-TBR-002",
          barcode: "1000000000182",
          name: "Extra Soft",
          price: 11000,
          disc_price: 9500,
          stock_qty: 80,
          createdBy: "SEEDER"
        },

        {
          product_id: 19,
          sku: "DOG-FD-001",
          barcode: "1000000000191",
          name: "1kg",
          price: 40000,
          disc_price: 38000,
          stock_qty: 60,
          createdBy: "SEEDER"
        },
        {
          product_id: 19,
          sku: "DOG-FD-002",
          barcode: "1000000000192",
          name: "2kg",
          price: 75000,
          disc_price: 72000,
          stock_qty: 40,
          createdBy: "SEEDER"
        },

        {
          product_id: 20,
          sku: "CAT-LTR-001",
          barcode: "1000000000201",
          name: "5L",
          price: 30000,
          disc_price: 28000,
          stock_qty: 70,
          createdBy: "SEEDER"
        },
        {
          product_id: 20,
          sku: "CAT-LTR-002",
          barcode: "1000000000202",
          name: "10L",
          price: 55000,
          disc_price: 52000,
          stock_qty: 50,
          createdBy: "SEEDER"
        }
      ]
    });
  });
  console.log('Multiple Users Created!');
}