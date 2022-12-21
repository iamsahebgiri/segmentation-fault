import { router } from '~/server/trpc/trpc';
import { questionRouter } from './question';

export const appRouter = router({
  question: questionRouter,
});

export type AppRouter = typeof appRouter;
