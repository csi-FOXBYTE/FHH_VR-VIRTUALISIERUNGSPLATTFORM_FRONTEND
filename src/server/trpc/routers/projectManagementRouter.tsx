import { z } from "zod";
import { protectedProcedure, router } from "..";
import { Prisma } from "@prisma/client";

const projectManagementRouter = router({
  list: protectedProcedure
    .input(z.object({ page: z.number(), rowsPerPage: z.number() }))
    .query(async (opts) => {
      const where: Prisma.ProjectWhereInput = {};

      const [data, count] = await opts.ctx.db.$transaction(async (prisma) => {
        return await Promise.all([
          prisma.project.findMany({
            where,
            take: opts.input.rowsPerPage,
            skip: opts.input.page * opts.input.rowsPerPage,
            select: {
              id: true,
              description: true,
              title: true,
            },
          }),
          prisma.project.count({
            where,
          }),
        ]);
      });

      return { data, count };
    }),
});

export default projectManagementRouter;
