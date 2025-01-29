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
  //#region get WorkItem
  getWorkItem: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        workItemId: z.string(),
      })
    )
    .query(async (opts) => {
      const { projectId, workItemId } = opts.input;
      return opts.ctx.db.workItem.findFirstOrThrow({
        where: {
          id: workItemId,
          projectId
        },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          startDate: true,
          endDate: true,
          assignedToUser: true,
          dependsOnWorkItemId: true,
          dependencyType: true,
        }
      });
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
        dependsOnWorkItemId: z.string().optional() ?? undefined,
        dependencyType: z.nativeEnum(DEPENDENCY_TYPE).optional(),
        ressources: z.array(z.string()).optional(),
        description: z.string().optional().default(""),
        projectId: z.string(),
        createdAt: z.date(),
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


  //#region edit WorkItem
  editWorkItem: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        workItemId: z.string(),
        data: z.object({
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
          updatedAt: z.date(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { projectId, workItemId, data } = opts.input;

      const updatedWorkItem = await opts.ctx.db.workItem.update({
        where: {
          id: workItemId,
          projectId: projectId,
        },
        data: {
          name: data.name,
          status: data.status,
          priority: data.priority,
          startDate: data.startDate,
          endDate: data.endDate,
          assignedToUserId: data.assignedToUserId,
          dependencyType: data.dependencyType,
          ressources: data.ressources,
          description: data.description,
          updatedAt: data.updatedAt,
          dependsOnWorkItemId: data.dependsOnWorkItemId ?? undefined
        },
      });

      return updatedWorkItem;
    }),
});

export default workItemsRouter;