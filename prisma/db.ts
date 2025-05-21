import { PrismaClient } from "@prisma/client";
import { softDeleteMiddleware } from "./middleware";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
let prisma: PrismaClient;

if(!globalForPrisma.prisma) {
  prisma = new PrismaClient();
  prisma.$use(softDeleteMiddleware);
  globalForPrisma.prisma = prisma;
}else{
  prisma = globalForPrisma.prisma;
};

export const db = prisma;