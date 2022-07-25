import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { PageEntity } from "./page/page.entity";
import { VestingEntity } from "./mechanics/vesting/vesting.entity";
import { LootboxEntity } from "./mechanics/lootbox/lootbox.entity";
import { ClaimEntity } from "./mechanics/claim/claim.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingStakesEntity } from "./mechanics/staking/staking-stakes/staking-stakes.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CraftEntity } from "./mechanics/craft/craft.entity";
import { AssetEntity } from "./mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./mechanics/asset/asset-component.entity";
import { ContractHistoryEntity } from "./blockchain/contract-history/contract-history.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    VestingEntity,
    ContractHistoryEntity,
    UserEntity,
    CraftEntity,
    StakingStakesEntity,
    StakingRulesEntity,
    PageEntity,
    LootboxEntity,
    ClaimEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    AssetEntity,
    AssetComponentEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
