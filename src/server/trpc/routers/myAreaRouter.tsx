import { protectedProcedure, router } from "..";

const userInfoRouter = router({
  getLastLogin: protectedProcedure.query(async (opts) => {
    return await opts.ctx.db.session.findFirstOrThrow({
      select: {
        updatedAt: true,
      },
      where: {
        userId: opts.ctx.session.user.id,
      },
    });
  }),
});

export default userInfoRouter;
