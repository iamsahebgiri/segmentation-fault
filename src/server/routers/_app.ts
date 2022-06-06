import { createRouter } from '../createRouter';
import { questionRouter } from './question';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('question.', questionRouter);

export type AppRouter = typeof appRouter;
