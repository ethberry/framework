import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [AssetEntity, AssetComponentEntity, ContractEntity, TemplateEntity, TokenEntity],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: (process.env.LOG_MODE && process.env.LOG_MODE === "true") || false,
};

export default config;
