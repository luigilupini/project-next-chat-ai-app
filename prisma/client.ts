// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// warn(prisma-client) There are already 10 instances of Prisma Client actively running.

// Learn more:
// https://pris.ly/d/help/next-js-best-practices
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
  prismaCounter: number | undefined;
};

// If there's no prisma instance on globalThis, create one and increment the counter
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prismaClientSingleton();
  globalForPrisma.prismaCounter = (globalForPrisma.prismaCounter || 0) + 1;
  // Log only if in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ prisma client instance (count: ${globalForPrisma.prismaCounter})`
    );
  }
}

const prisma = globalForPrisma.prisma;

export default prisma;

// Ensure PrismaClient is on globalThis for both production and development
globalForPrisma.prisma = prisma;
