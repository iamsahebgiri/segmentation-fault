import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../trpc/trpc';

export const questionRouter = router({
  feed: publicProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(50).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const take = input?.take ?? 50;
      const skip = input?.skip;

      const where = {
        hidden: false,
        authorId: input?.authorId,
      };

      const questions = await ctx.prisma.question.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        where,
        select: {
          id: true,
          title: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          upvotedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      const questionCount = await ctx.prisma.question.count({
        where,
      });

      return {
        questions,
        questionCount,
      };
    }),
  detail: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const question = await ctx.prisma.question.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          upvotedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          comments: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              content: true,
              contentHtml: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      const questionBelongsToUser =
        question?.author.id === ctx.session?.user.id;
      let canViewHiddenQuestions = false;
      if (ctx.session) {
        canViewHiddenQuestions = ['ADMIN', 'MODERATOR'].includes(
          ctx.session?.user.role,
        );
      }
      if (
        !question ||
        (question.hidden && !questionBelongsToUser && !canViewHiddenQuestions)
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }

      return question;
    }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.prisma.question.findMany({
        take: 10,
        where: {
          hidden: false,
          title: { search: input.query },
          content: { search: input.query },
        },
        select: {
          id: true,
          title: true,
        },
      });

      return posts;
    }),

  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.question.create({
        data: {
          title: input.title,
          content: input.content,
          contentHtml: input.content,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return post;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
        }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id, data } = input;

      const post = await ctx.prisma.question.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });

      const postBelongsToUser = post?.author.id === ctx.session.user.id;

      if (!postBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const updatedPost = await ctx.prisma.question.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: data.content,
        },
      });

      return updatedPost;
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const post = await ctx.prisma.question.findUnique({
        where: { id },
        select: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });

      const postBelongsToUser = post?.author.id === ctx.session.user.id;

      if (!postBelongsToUser) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      await ctx.prisma.question.delete({ where: { id } });
      return id;
    }),
  like: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.upvotedQuestions.create({
        data: {
          question: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return id;
    }),
  unlike: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.upvotedQuestions.delete({
        where: {
          questionId_userId: {
            questionId: id,
            userId: ctx.session.user.id,
          },
        },
      });

      return id;
    }),
});
