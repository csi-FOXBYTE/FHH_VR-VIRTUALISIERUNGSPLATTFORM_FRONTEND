import { dataGridZod } from "@/components/dataGridServerSide/zodTypes";
import { protectedProcedure, router } from "..";

const projectManagementRouter = router({
  listMyProjects: protectedProcedure.input(dataGridZod).query(
    async (opts) =>
      await opts.ctx.db.project.paginate(
        {
          where: {
            ownerId: opts.ctx.session.user.id,
          },
        },
        opts.input
      )
  ),
  listSharedProjects: protectedProcedure
    .input(dataGridZod)
    .query(async (opts) => {
      await opts.ctx.db.project.paginate({}, opts.input);
    }),
});

export default projectManagementRouter;
