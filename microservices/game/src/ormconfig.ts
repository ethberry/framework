import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    AssetEntity,
    AssetComponentEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    ClaimEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
