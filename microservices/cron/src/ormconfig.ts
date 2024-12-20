import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [ContractEntity],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.LOG_MODE === "true",
};

export default config;
