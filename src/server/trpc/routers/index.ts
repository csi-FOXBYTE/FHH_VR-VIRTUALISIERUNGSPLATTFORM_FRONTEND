import "server-only";

import { router } from "..";
import myAreaRouter from "./myAreaRouter";
import projectRouter from "./projectRouter";
import projectManagementRouter from "./projectManagementRouter";
import eventsRouter from "./eventsRouter";
import subscriptionRouter from "./subscriptionRouter";
import dataManagementRouter from "./dataManagementRouter";

export const appRouter = router({
    myAreaRouter,
    projectRouter,
    projectManagementRouter,
    eventsRouter,
    subscriptionRouter,
    dataManagementRouter
});

export type AppRouter = typeof appRouter;
