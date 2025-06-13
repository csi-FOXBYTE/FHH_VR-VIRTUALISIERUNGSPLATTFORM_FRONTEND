import "server-only";

import { router } from "..";
import myAreaRouter from "./myAreaRouter";
import projectRouter from "./projectRouter";
import projectManagementRouter from "./projectManagementRouter";

export const appRouter = router({
    myAreaRouter,
    projectRouter,
    projectManagementRouter,
});

export type AppRouter = typeof appRouter;
