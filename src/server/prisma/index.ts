import "server-only";
import { PrismaClient } from "@prisma/client";
import { versioningExtension } from "./extensions/versioningExtension";
import realtimeExtension from "./extensions/realtimeExtension";

const prismaClientSingleton = () => {
  return new PrismaClient()
    .$extends(realtimeExtension({ intervalMs: 1000 }))
    .$extends(versioningExtension());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
