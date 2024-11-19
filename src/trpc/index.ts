import { authOptions } from "@/auth/authOptions";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { cache } from "react";
import SuperJSON from "superjson";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const { createCallerFactory, router, procedure } = initTRPC
  .context<typeof createTRPCContext>()
  .create({
    transformer: SuperJSON,
  });

export const createTRPCContext = cache(
  async (opts: FetchCreateContextFnOptions) => {
    const session = await getServerSession(authOptions);

    return {
      session,
    };
  }
);

export const protectedProcedure = procedure.use(async ({ next, ctx }) => {
  const session = ctx.session;

  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" }); // Only authenticated users are allowed!

  return next({
    ctx: {
      ...ctx,
      session: session,
    },
  });
});
