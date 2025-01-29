import { z } from "zod";
import { protectedProcedure, router } from "..";
import { createOrderBy } from "@/server/prisma/utils";
import { DEPENDENCY_TYPE, PRIORITY, WORK_ITEM_STATUS } from "@prisma/client";

const workItemsRouter = router({

  //#region get WorkItems
  getWorkItems: protectedProcedure([])
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        projectId: z.string(),
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
          projectId: opts.input.projectId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          startDate: true,
          endDate: true,
          assignedToUser: true,
        },
      });
      const count = await opts.ctx.db.workItem.count({
        where: {
          projectId: opts.input.projectId,
        },
      });
      return { data, count };
    }),

  //#region add WorkItem
  addWorkItem: protectedProcedure([])
    .input(
      z.object({
        name: z.string(),
        status: z.nativeEnum(WORK_ITEM_STATUS),
        priority: z.nativeEnum(PRIORITY),
        startDate: z.date(),
        endDate: z.date(),
        assignedToUserId: z.string(),
        dependsOnWorkItemId: z.string().optional(),
        dependencyType: z.nativeEnum(DEPENDENCY_TYPE).optional(),
        ressources: z.array(z.string()).optional(),
        description: z.string().optional().default(""),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const workItem = await ctx.db.workItem.create({
          data: {
            ...input,
          },
        });

        return {
          success: true,
          message: "Work item successfully created",
          workItemId: workItem.id,
        };
      } catch (error) {
        console.error("Error creating work item:", error);
        return {
          success: false,
          message: "An error occurred while creating the work item",
        };
      }
    }),

  //#region delete WorkItem
  deleteWorkItem: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        workItemId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { projectId, workItemId } = opts.input;

      try {
        await opts.ctx.db.project.update({
          where: { id: projectId },
          data: {
            WorkItem: {
              disconnect: { id: workItemId },
            },
          },
        });

        return { success: true, message: "WorkItem successfully removed" };
      } catch (error: unknown) {
        console.error("Error removing WorkItem:", error);
        return { success: false, message: error || "An error occurred" };
      }
    }),

});

export default workItemsRouter;