import path from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@gemunion/framework-constants";

import { WatcherEntity } from "./watcher/watcher.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_URL as string,
  entities: [WatcherEntity],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: process.env.NODE_ENV !== "production",
  migrationsTableName: ns,
  migrationsTransactionMode: "each",
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging",
  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or server folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [path.join(__dirname, "/migrations/**/*{.ts,.js}")],
  cli: {
    // Location of migration should be inside server folder
    // to be compiled into dist/ folder.
    migrationsDir: "src/migrations",
  },
};

export default config;
