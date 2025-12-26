// Lazy-load Prisma to avoid importing it during config loading
let prismaInstance: any = null;

export async function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  // Only import these when actually needed (at runtime)
  const prismaModule = await import("@prisma/client") as any;
  const PrismaClient = prismaModule.PrismaClient;
  const { Pool } = await import("pg");
  const { PrismaPg } = await import("@prisma/adapter-pg");

  // Load environment variables
  await import("dotenv/config");

  // Create a connection pool
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  // PrismaClient is attached to the `global` object in development to prevent
  // exhausting your database connection limit.
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;

  return prismaInstance;
}

