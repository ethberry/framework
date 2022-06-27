import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { UniContractEntity } from "./uni-token/uni-contract.entity";
import { UniTemplateEntity } from "./uni-token/uni-template.entity";
import { UniTokenEntity } from "./uni-token/uni-token.entity";
import { AirdropEntity } from "./blockchain/airdrop/airdrop.entity";
import { DropboxEntity } from "./blockchain/dropbox/dropbox.entity";
import { AssetEntity } from "./blockchain/asset/asset";
import { AssetComponentEntity } from "./blockchain/asset/asset-component";

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
    AirdropEntity,
    DropboxEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
