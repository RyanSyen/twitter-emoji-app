import { clerkClient } from "@clerk/nextjs";

import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUser } from "~/server/helpers/filterUserForClient";

// Create a new ratelimiter, that allows 5 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, "1 m"),
  analytics: true,
});

// publicProcedure is a mtd that gens a func that your client calls
export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUser);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });

      return {
        post,
        author,
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: authorId, username, firstName, lastName } = ctx.currentUser;
      const name = !username ? `${firstName}${lastName}` : username;

      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      return await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
          name,
        },
      });
    }),
});
