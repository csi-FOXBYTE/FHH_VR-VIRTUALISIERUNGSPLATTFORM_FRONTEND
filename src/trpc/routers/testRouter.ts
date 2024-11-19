import { protectedProcedure, router } from "..";

const testRouter = router({
  test: protectedProcedure.query(async (opts) => {
    console.log("HIT");
    return { payload: "test" };
  }),
  longRequest: protectedProcedure.query(async (opts) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { long: "request" };
  }),
});

export default testRouter;
