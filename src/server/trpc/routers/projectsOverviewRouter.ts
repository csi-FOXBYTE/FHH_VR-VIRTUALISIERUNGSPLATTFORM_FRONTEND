import { z } from "zod";
import { protectedProcedure, router } from "..";
import { createOrderBy } from "@/server/prisma/utils";
import { projectOverviewFilter } from "@/components/project/ProjectOverviewFilter";

const projectsOverviewRouter = router({
  //#region getProjects
  getProjects: protectedProcedure([])
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        filter: projectOverviewFilter.nullable(),
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
          projectManagerId:
            (opts.input.filter?.myProjects
              ? opts.ctx.session.user.id
              : undefined) ?? opts.input.filter?.projectManagerId,
          buildingId: opts.input.filter?.buildingId,
          status: opts.input.filter?.status,
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
        count: await opts.ctx.db.project.count({
          orderBy: createOrderBy(
            "Project",
            opts.input.sortBy,
            opts.input.sortOrder
          ),
          where: {
            projectManagerId:
              (opts.input.filter?.myProjects
                ? opts.ctx.session.user.id
                : undefined) ?? opts.input.filter?.projectManagerId,
            buildingId: opts.input.filter?.buildingId,
            status: opts.input.filter?.status,
          },
        }),
      };
    }),
  //#region add Project
  addProject: protectedProcedure([])
    .input(
      z.object({
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        creatorId: z.string(),
        projectManagerId: z.string(),
        status: z.enum(["IN_WORK", "DELAYED", "CRITICAL"]),
        name: z.string(),
        contactPersonId: z.string(),
        testBenchNumber: z.number().optional(),
        startDate: z.date(),
        endDate: z.date(),
        projectType: z.string(),
        plannedBudget: z.number().optional(),
        calculateTargetFromSubProjectSpecifications: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("_________Received input in mutation:", input);
        const project = await ctx.db.project.create({
          data: {
            ...input,
            createdAt: input.createdAt ?? new Date(),
            updatedAt: input.updatedAt ?? new Date(),
          },
        });

        return {
          success: true,
          message: "Project successfully created",
          projectId: project.id,
        };
      } catch (error) {
        console.error("Error creating Project:", error);
        return {
          success: false,
          message: "An error occurred while creating the Project",
        };
      }
    }),

});

export default projectsOverviewRouter;
