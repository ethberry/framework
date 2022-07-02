import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ContractManagerHistoryEntity } from "./blockchain/contract-manager/contract-manager-history/contract-manager-history.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { Erc20TokenHistoryEntity } from "./erc20/token/token-history/token-history.entity";
import { VestingEntity } from "./mechanics/vesting/vesting/vesting.entity";
import { Erc721TokenHistoryEntity } from "./erc721/token/token-history/token-history.entity";
import { Erc721MarketplaceHistoryEntity } from "./erc721/marketplace/marketplace-history/marketplace-history.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";
import { Erc1155TokenHistoryEntity } from "./erc1155/token/token-history/token-history.entity";
import { Erc1155MarketplaceHistoryEntity } from "./erc1155/marketplace/marketplace-history/marketplace-history.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessControlHistoryEntity } from "./blockchain/access-control/access-control-history/access-control-history.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingStakesEntity } from "./mechanics/staking/staking-stakes/staking-stakes.entity";
import { ExchangeHistoryEntity } from "./mechanics/exchange/exchange-history/exchange-history.entity";
import { ExchangeRulesEntity } from "./mechanics/exchange/exchange-rules/exchange-rules.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
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
    VestingEntity,
    StakingRulesEntity,
    StakingStakesEntity,
    StakingHistoryEntity,
    Erc721TokenHistoryEntity,
    Erc721MarketplaceHistoryEntity,
    AirdropEntity,
    DropboxEntity,
    ExchangeRulesEntity,
    ExchangeHistoryEntity,
    Erc1155TokenHistoryEntity,
    Erc1155MarketplaceHistoryEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    AssetEntity,
    AssetComponentEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
