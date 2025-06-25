import {
  createFilters,
  createSort,
} from "@/components/dataGridServerSide/helpers";
import { dataGridZod } from "@/components/dataGridServerSide/zodTypes";
import { protectedProcedure, router } from "..";

const projectManagementRouter = router({
  list: protectedProcedure.input(dataGridZod).query(async (opts) => {
    const where = createFilters("Project", [], opts.input.filterModel);
    const orderBy = createSort("Project", opts.input.sortModel);

    const [data, count] = await opts.ctx.db.$transaction(async (prisma) => {
      return await Promise.all([
        prisma.project.findMany({
          orderBy,
          where,
          take: opts.input.paginationModel.pageSize,
          skip:
            opts.input.paginationModel.page *
            opts.input.paginationModel.pageSize,
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
