import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import {
  ContractManagerHistoryEntity
} from "./blockchain/contract-manager/contract-manager-history/contract-manager-history.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { Erc20TokenHistoryEntity } from "./erc20/token/token-history/token-history.entity";
import { Erc20VestingEntity } from "./vesting/vesting/vesting.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { Erc721MarketplaceHistoryEntity } from "./erc721/marketplace/marketplace-history/marketplace-history.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token/token-history/token-history.entity";
import { Erc1155MarketplaceHistoryEntity } from "./erc1155/marketplace/marketplace-history/marketplace-history.entity";
import { Erc1155BalanceEntity } from "./erc1155/balance/balance.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import {
  AccessControlHistoryEntity
} from "./blockchain/access-control/access-control-history/access-control-history.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakesEntity } from "./mechanics/staking/stakes/stakes.entity";
import { ExchangeHistoryEntity } from "./mechanics/exchange/exchange-history/exchange-history.entity";
import { ExchangeEntity } from "./mechanics/exchange/exchange.entity";
import { UniTokenEntity } from "./blockchain/uni-token/uni-token.entity";
import { UniContractEntity } from "./blockchain/uni-token/uni-contract.entity";
import { UniTemplateEntity } from "./blockchain/uni-token/uni-template.entity";
import { AssetEntity } from "./blockchain/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/asset/asset-component.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerEntity,
    ContractManagerHistoryEntity,
    AccessControlEntity,
    AccessControlHistoryEntity,
    Erc20TokenHistoryEntity,
    Erc20VestingEntity,
    StakingRulesEntity,
    StakesEntity,
    StakingHistoryEntity,
    Erc721TokenHistoryEntity,
    Erc721MarketplaceHistoryEntity,
    AirdropEntity,
    DropboxEntity,
    ExchangeEntity,
    ExchangeHistoryEntity,
    Erc1155TokenHistoryEntity,
    Erc1155MarketplaceHistoryEntity,
    Erc1155BalanceEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    AssetEntity,
    AssetComponentEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
