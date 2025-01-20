import { z } from "zod";
import { protectedProcedure, router } from "..";
import { createOrderBy } from "@/server/prisma/utils";

const projectsOverviewRouter = router({
  getProjects: protectedProcedure([])
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        filter: z.record(z.string(), z.string()).optional(),
        search: z.record(z.string(), z.string()).optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async (opts) => {
      const data = await opts.ctx.db.project.findMany({
        skip: opts.input.skip,
        take: opts.input.limit,
        orderBy: createOrderBy(
          "Project",
          opts.input.sortBy,
          opts.input.sortOrder
        ),
        where: {

        },
        select: {
          name: true,
          id: true,
          startDate: true,
          endDate: true,
          building: {
            select: {
              name: true,
            },
          },
          projectManager: {
            select: {
              name: true,
              id: true,
            },
          },
          status: true,
        },
      });

      return {
        data,
        count: await opts.ctx.db.project.count({}),
      };
    }),
});

export default projectsOverviewRouter;
