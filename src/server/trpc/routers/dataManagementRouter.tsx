import {
  createFilters,
  createSort,
} from "@/components/dataGridServerSide/helpers";
import { dataGridZod } from "@/components/dataGridServerSide/zodTypes";
import { protectedProcedure, router } from "..";
import { z } from "zod";

const dataManagementRouter = router({
  listBaseLayers: protectedProcedure.input(dataGridZod).query(async (opts) => {
    const where = createFilters("BaseLayer", ["name"], opts.input.filterModel);
    const orderBy = createSort("BaseLayer", opts.input.sortModel);

    const baseLayers = await opts.ctx.db.baseLayer.findMany({
      where,
      orderBy,
      take: opts.input.paginationModel.pageSize,
      skip:
        opts.input.paginationModel.page * opts.input.paginationModel.pageSize,
      select: {
        id: true,
        sizeGB: true,
        createdAt: true,
        name: true,
        creator: {
          select: {
            name: true,
          },
        },
        description: true,
        type: true,
      },
    });

    const baseLayerCount = await opts.ctx.db.baseLayer.count({
      where,
    });

    return { data: baseLayers, count: baseLayerCount };
  }),
  createVisualAxis: protectedProcedure
    .input(
      z.object({
        endPointX: z.number(),
        endPointY: z.number(),
        endPointZ: z.number(),
        startPointX: z.number(),
        startPointY: z.number(),
        startPointZ: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      return await opts.ctx.db.visualAxis.create({
        data: {
          ...opts.input,
        },
      });
    }),
  updateVisualAxis: protectedProcedure
    .input(
      z.object({
        endPointX: z.number(),
        endPointY: z.number(),
        endPointZ: z.number(),
        startPointX: z.number(),
        startPointY: z.number(),
        startPointZ: z.number(),
        name: z.string(),
        description: z.string().optional(),
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { id, ...rest } = opts.input;
      return await opts.ctx.db.visualAxis.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      });
    }),
  listVisualAxes: protectedProcedure.input(dataGridZod).query(async (opts) => {
    const where = createFilters("VisualAxis", ["name"], opts.input.filterModel);
    const orderBy = createSort("VisualAxis", opts.input.sortModel);

    const baseLayers = await opts.ctx.db.visualAxis.findMany({
      where,
      orderBy,
      take: opts.input.paginationModel.pageSize,
      skip:
        opts.input.paginationModel.page * opts.input.paginationModel.pageSize,
      select: {
        id: true,
        createdAt: true,
        name: true,
        description: true,
        endPointX: true,
        endPointY: true,
        endPointZ: true,
        startPointX: true,
        startPointY: true,
        startPointZ: true,
      },
    });

    const baseLayerCount = await opts.ctx.db.baseLayer.count({
      where,
    });

    return { data: baseLayers, count: baseLayerCount };
  }),
  getVisualAxis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const visualAxis = await opts.ctx.db.visualAxis.findFirstOrThrow({
        where: {
          id: opts.input.id,
        },
        select: {
          endPointX: true,
          endPointY: true,
          endPointZ: true,
          startPointX: true,
          startPointY: true,
          startPointZ: true,
          name: true,
          description: true,
        },
      });

      return {
        endPoint: {
          x: visualAxis.endPointX,
          y: visualAxis.endPointY,
          z: visualAxis.endPointZ,
        },
        startPoint: {
          x: visualAxis.startPointX,
          y: visualAxis.startPointY,
          z: visualAxis.startPointZ,
        },
        name: visualAxis.name,
        description: visualAxis.description,
      };
    }),
});

export default dataManagementRouter;
