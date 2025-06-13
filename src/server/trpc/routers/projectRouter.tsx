import { protectedProcedure, router } from "..";
import { z } from "zod";

const projectRouter = router({
  update: protectedProcedure
    .input(
      z.object({ id: z.string(), title: z.string(), description: z.string() })
    )
    .mutation(async (opts) => {
      return await opts.ctx.db.project.update({
        where: {
          owner: {
            id: opts.ctx.session.user.id,
          },
          id: opts.input.id,
        },
        data: {},
      });
    }),
  getTitle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      return await opts.ctx.db.project.findFirstOrThrow({
        where: {
          id: opts.input.id,
        },
        select: {
          title: true,
        },
      });
    }),
  getFull: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      return await opts.ctx.db.project.findFirstOrThrow({
        where: {
          id: opts.input.id,
        },
        include: { owner: true },
      });
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async (opts) => {
      return await opts.ctx.db.project.create({
        data: {
          owner: {
            connect: {
              id: opts.ctx.session.user.id,
            },
          },
          description: opts.input.description,
          title: opts.input.title,
        },
        select: {
          id: true,
        },
      });
    }),
});

export default projectRouter;
