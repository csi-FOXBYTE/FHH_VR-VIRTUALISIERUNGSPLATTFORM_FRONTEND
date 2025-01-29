import { z } from "zod";
import { protectedProcedure, router } from "..";
import { createOrderBy } from "@/server/prisma/utils";

const workItemsRouter = router({

  //#region get WorkItems
  getWorkItems: protectedProcedure([])
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        userId: z.string(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async (opts) => {
      const data = await opts.ctx.db.workItem.findMany({
        skip: opts.input.skip,
        take: opts.input.limit,
        orderBy: createOrderBy(
          "User",
          opts.input.sortBy,
          opts.input.sortOrder
        ),
        where: {
          assignedToUserId: opts.input.userId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          startDate: true,
          endDate: true,
          project: true,
        },
      });
      const count = await opts.ctx.db.workItem.count({
        where: {
          projectId: opts.input.userId,
        },
      });
      return { data, count };
    }),
});

export default workItemsRouter;