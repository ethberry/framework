import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { UserEntity } from "./infrastructure/user/user.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    AssetComponentEntity,
    AssetEntity,
    BalanceEntity,
    ClaimEntity,
    ContractEntity,
    MerchantEntity,
    SettingsEntity,
    TemplateEntity,
    TokenEntity,
    UserEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
