import { protectedProcedure, router } from "..";
import prisma from "@/server/prisma";
import z from "zod";

const testRouter = router({
  test: protectedProcedure.query(async () => {
    console.log("HIT");
    return { payload: "test" };
  }),
  longRequest: protectedProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { long: "request" };
  }),
  halloWelt: protectedProcedure.mutation(async () => {
    return "Hallo Welt";
  }),
  errorWorld: protectedProcedure
    .input(z.object({ a: z.string(), b: z.boolean() }))
    .mutation(async () => {
      return await prisma.user.findFirstOrThrow({
        where: {
          id: "pustekuchen",
        },
      });
    }),
  getProjects: protectedProcedure.query(async (opts) => {
    return [
      {
        name: "Hallo",
        id: "abc",
      },
      {
        name: "Test",
        id: "cde",
      },
    ];
  }),
});

export default testRouter;
