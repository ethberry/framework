import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { DropboxEntity } from "./blockchain/dropbox/dropbox.entity";
import { AirdropEntity } from "./blockchain/airdrop/airdrop.entity";
import { Erc998TokenHistoryEntity } from "./erc998/token/token-history/token-history.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token-history/token-history.entity";
import { StakingEntity } from "./blockchain/staking/staking.entity";
import { PageEntity } from "./page/page.entity";
import { StakesEntity } from "./blockchain/staking/stakes/stakes.entity";
import { UniContractEntity } from "./uni-token/uni-contract.entity";
import { UniTemplateEntity } from "./uni-token/uni-template.entity";
import { UniTokenEntity } from "./uni-token/uni-token.entity";
import { UniBalanceEntity } from "./uni-token/uni-balance.entity";
import { ExchangeEntity } from "./blockchain/exchange/exchange.entity";
import { AssetEntity } from "./blockchain/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/asset/asset-component.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    Erc20VestingEntity,
    Erc721TokenHistoryEntity,
    Erc998TokenHistoryEntity,
    Erc1155TokenHistoryEntity,
    UserEntity,
    StakesEntity,
    ExchangeEntity,
    StakingEntity,
    PageEntity,
    DropboxEntity,
    AirdropEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    UniBalanceEntity,
    AssetEntity,
    AssetComponentEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
