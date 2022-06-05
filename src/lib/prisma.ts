import { serverEnv } from '~/env/server';
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      serverEnv.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (serverEnv.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
