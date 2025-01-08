import "server-only";

import { router } from "..";
import testRouter from "./testRouter";
import indexRouter from "./indexRouter";

export const appRouter = router({
  testRouter,
  indexRouter,
});

export type AppRouter = typeof appRouter;
