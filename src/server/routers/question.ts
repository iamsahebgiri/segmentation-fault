/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/lib/prisma';

const defaultQuestionSelect = Prisma.validator<Prisma.QuestionSelect>()({
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
});

export const questionRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.number().optional(),
      title: z.string().min(1),
      content: z.string().min(1),
      contentHtml: z.string(),
      authorId: z.string(),
    }),
    async resolve({ input }) {
      const question = await prisma.question.create({
        data: input,
        select: defaultQuestionSelect,
      });
      return question;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.question.findMany({
        select: defaultQuestionSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const question = await prisma.question.findUnique({
        where: { id },
        select: defaultQuestionSelect,
      });
      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No question with id '${id}'`,
        });
      }
      return question;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        text: z.string().min(1).optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const question = await prisma.question.update({
        where: { id },
        data,
        select: defaultQuestionSelect,
      });
      return question;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.question.delete({ where: { id } });
      return {
        id,
      };
    },
  });
