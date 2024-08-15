import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "./config/env";
import { db } from "./db";
import { buildServer } from "./utils/server";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}`);
      await gracefulShutdown({ app });
      process.exit(0);
    });
  });
}

main();
