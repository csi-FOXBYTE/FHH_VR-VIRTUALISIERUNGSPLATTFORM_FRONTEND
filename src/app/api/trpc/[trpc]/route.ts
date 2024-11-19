import { createTRPCContext } from "@/trpc";
import { appRouter } from "@/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => fetchRequestHandler({
  router: appRouter,
  req,
  endpoint: "/api/trpc",
  createContext: createTRPCContext,
});

export { handler as GET, handler as POST };
