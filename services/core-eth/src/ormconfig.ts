import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ContractManagerHistoryEntity } from "./blockchain/contract-manager/contract-manager-history/contract-manager-history.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { ContractHistoryEntity } from "./blockchain/contract-history/contract-history.entity";
import { VestingEntity } from "./mechanics/vesting/vesting.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { LootboxEntity } from "./mechanics/lootbox/lootbox.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessControlHistoryEntity } from "./blockchain/access-control/access-control-history/access-control-history.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingStakesEntity } from "./mechanics/staking/staking-stakes/staking-stakes.entity";
import { ExchangeHistoryEntity } from "./mechanics/exchange/exchange-history/exchange-history.entity";
import { ExchangeEntity } from "./mechanics/exchange/exchange.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./mechanics/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerEntity,
    ContractManagerHistoryEntity,
    AccessControlEntity,
    AccessControlHistoryEntity,
    ContractHistoryEntity,
    VestingEntity,
    StakingRulesEntity,
    StakingStakesEntity,
    StakingHistoryEntity,
    AirdropEntity,
    LootboxEntity,
    ExchangeEntity,
    ExchangeHistoryEntity,
    ContractEntity,
    TemplateEntity,
    BalanceEntity,
    TokenEntity,
    AssetEntity,
    AssetComponentEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
