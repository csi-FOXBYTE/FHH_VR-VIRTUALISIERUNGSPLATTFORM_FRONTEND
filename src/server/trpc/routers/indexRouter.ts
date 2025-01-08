import { z } from "zod";
import { protectedProcedure, router } from "..";

const indexRouter = router({
  allProjects: protectedProcedure(["user:read", "project:read"])
    .input(z.object({ limit: z.number() }))
    .query(async (opts) => {
        return opts.ctx.services.project.getAllProjects(opts.input.limit);
    }),
});

export default indexRouter;
