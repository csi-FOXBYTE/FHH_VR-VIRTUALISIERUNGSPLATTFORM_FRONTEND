import { tracked } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "..";
import { eachValueFromAbortable } from "@/server/helpers";

const subscriptionRouter = router({
  subscribe: protectedProcedure
    .input(z.string())
    .subscription(async function* (opts) {
      for await (const value of eachValueFromAbortable(
        // @ts-expect-error unsafe
        opts.ctx.subscriberDb[opts.input].subscribe({ operations: ["*"] }),
        opts.signal
      )) {
        yield tracked(value.id, value);
      }
    }),
});

export default subscriptionRouter;
