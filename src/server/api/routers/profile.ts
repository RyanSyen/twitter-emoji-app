import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUser } from "~/server/helpers/filterUserForClient";

// publicProcedure is a mtd that gens a func that your client calls
export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ userid: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        userId: [input.userid],
        // username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUser(user);
    }),
});
