import "server-only";

import { router } from "..";
import myAreaRouter from "./myAreaRouter";

export const appRouter = router({
    myAreaRouter,
});

export type AppRouter = typeof appRouter;
