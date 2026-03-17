import { PrismaClient } from '@prisma/client';
import process from 'process';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// This "Singleton" pattern prevents creating too many DB connections during development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;