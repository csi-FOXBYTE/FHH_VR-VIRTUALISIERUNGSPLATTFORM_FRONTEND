import { protectedProcedure, router } from "..";

const testRouter = router({
  test: protectedProcedure.query(async () => {
    console.log("HIT");
    return { payload: "test" };
  }),
  longRequest: protectedProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { long: "request" };
  }),
  halloWelt: protectedProcedure.query(async () => {
    return "Hallo Welt";
  })
});

export default testRouter;
