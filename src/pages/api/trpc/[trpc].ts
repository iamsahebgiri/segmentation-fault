import { createNextApiHandler } from '@trpc/server/adapters/next';

import { serverEnv } from '~/env/server';
import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/routers/_app';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    serverEnv.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
