import { z } from "zod";
import { protectedProcedure, router } from "..";
import { createOrderBy } from "@/server/prisma/utils";
import { DEPENDENCY_TYPE, PRIORITY, WORK_ITEM_STATUS } from "@prisma/client";

const participantsRouter = router({

  //#region Get Participants
  getParticipants: protectedProcedure([])
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
      const data = await opts.ctx.db.user.findMany({
        skip: opts.input.skip,
        take: opts.input.limit,
        orderBy: createOrderBy(
          "User",
          opts.input.sortBy,
          opts.input.sortOrder
        ),
        where: {
          participatingProjects: {
            some: {
              id: opts.input.projectId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          roles: true,
          department: true,
          etage: true,
        },
      });
      const count = await opts.ctx.db.requirement.count({
        where: {
          projectId: opts.input.projectId,
        },
      });
      return { data, count };
    }),

  //#region Add Participant*S*

  addParticipants: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        userIds: z.array(z.string()),
      })
    )
    .mutation(async (opts) => {
      const { projectId, userIds } = opts.input;

      try {
        await opts.ctx.db.project.update({
          where: { id: projectId },
          data: {
            participants: {
              connect: userIds.map((userId) => ({ id: userId })),
            },
          },
        });

        return { success: true, message: `${userIds.length} participants added` };
      } catch (error: unknown) {
        console.error("Error adding participants:", error);
        return { success: false, message: error || "An error occurred" };
      }
    }),

  //#region Add Participant

  addParticipant: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { projectId, userId } = opts.input;

      try {
        await opts.ctx.db.project.update({
          where: { id: projectId },
          data: {
            participants: {
              connect: { id: userId },
            },
          },
        });

        return { success: true };
      } catch (error: unknown) {
        throw error;
      }
    }),


  //#region Search Participant

  searchParticipant: protectedProcedure([])
    .input(z.object({ name: z.string() }))
    .query(async (opts) => {
      const participants = await opts.ctx.db.user.findMany({
        take: 10,
        skip: 0,
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          id: true,
        },
        where: {
          name: {
            contains: opts.input.name,
            mode: "insensitive",
          },
        },
      });

      return participants.map((participant) => ({
        label: participant.name,
        value: participant.id,
        option: participant.name
      }));
    }),

  //#region Delete Participant

  deleteParticipant: protectedProcedure([])
    .input(
      z.object({
        projectId: z.string(),
        participantId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { projectId, participantId } = opts.input;

      try {
        await opts.ctx.db.project.update({
          where: { id: projectId },
          data: {
            participants: {
              disconnect: { id: participantId },
            },
          },
        });

        return { success: true, message: "Participant successfully removed" };
      } catch (error: unknown) {
        console.error("Error removing participant:", error);
        return { success: false, message: error || "An error occurred" };
      }
    }),
  //#region get Users
  //TODO: add permissions
  getUsers: protectedProcedure([])
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async (opts) => {
      const data = await opts.ctx.db.user.findMany({
        skip: opts.input.skip,
        take: opts.input.limit,
        orderBy: createOrderBy(
          "User",
          opts.input.sortBy,
          opts.input.sortOrder
        ),
        select: {
          id: true,
          image: true,
          name: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          roles: true,
          department: true,
          etage: true,
        },
      });
      const count = await opts.ctx.db.user.count({});
      return { data, count };
    }),
  //#region search User
  searchUser: protectedProcedure([])
    .input(z.object({ name: z.string() }))
    .query(async (opts) => {
      const data = await opts.ctx.db.user.findMany({
        take: 10,
        skip: 0,
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          id: true,
        },
        where: {
          name: {
            contains: opts.input.name,
            mode: "insensitive",
          },
        },
      });

      return data.map((user) => ({
        label: user.name,
        value: user.id,
        option: user.name
      }));
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
});

export default participantsRouter;