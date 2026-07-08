import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma(): PrismaClient {
  const isEdgeRuntime =
    typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge";
  if (process.env.NODE_ENV === "production" && isEdgeRuntime) {
    const ctx = getOptionalRequestContext();
    if (ctx?.env && "DB" in ctx.env) {
      const adapter = new PrismaD1(ctx.env.DB as never);
      return new PrismaClient({ adapter });
    }
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
