import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { PageEntity } from "./page/page.entity";
import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { Erc998TokenHistoryEntity } from "./erc998/token/token-history/token-history.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token-history/token-history.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingStakesEntity } from "./mechanics/staking/staking-stakes/staking-stakes.entity";
import { UniContractEntity } from "./blockchain/uni-token/uni-contract/uni-contract.entity";
import { UniTemplateEntity } from "./blockchain/uni-token/uni-template/uni-template.entity";
import { UniTokenEntity } from "./blockchain/uni-token/uni-token/uni-token.entity";
import { UniBalanceEntity } from "./blockchain/uni-token/uni-balance/uni-balance.entity";
import { ExchangeRulesEntity } from "./mechanics/exchange/exchange-rules/exchange-rules.entity";
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
    ExchangeRulesEntity,
    StakingStakesEntity,
    StakingRulesEntity,
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
