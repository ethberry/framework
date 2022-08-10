import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { PageEntity } from "./page/page.entity";
import { VestingEntity } from "./blockchain/mechanics/vesting/vesting.entity";
import { MysteryboxEntity } from "./blockchain/mechanics/mysterybox/mysterybox.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingStakesEntity } from "./blockchain/mechanics/staking/stakes/stakes.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CraftEntity } from "./blockchain/mechanics/craft/craft.entity";
import { AssetEntity } from "./blockchain/mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/mechanics/asset/asset-component.entity";
import { ContractHistoryEntity } from "./blockchain/contract-history/contract-history.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";

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
    MysteryboxEntity,
    ClaimEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    AssetEntity,
    AssetComponentEntity,
    DropEntity,
    GradeEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
