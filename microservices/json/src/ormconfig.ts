import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { AssetEntity } from "./blockchain/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/asset/asset-component.entity";
import { UniContractEntity } from "./blockchain/uni-token/uni-contract/uni-contract.entity";
import { UniTemplateEntity } from "./blockchain/uni-token/uni-template/uni-template.entity";
import { UniTokenEntity } from "./blockchain/uni-token/uni-token/uni-token.entity";
import { UniBalanceEntity } from "./blockchain/uni-token/uni-balance/uni-balance.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    AssetEntity,
    AssetComponentEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    UniBalanceEntity,
    AirdropEntity,
    DropboxEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
