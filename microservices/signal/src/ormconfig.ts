import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./infrastructure/user/user.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    /* infrastructure */
    UserEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.LOG_MODE === "true",
};

export default config;
