import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./user/user.entity";
import { PageEntity } from "./page/page.entity";
import { VestingEntity } from "./blockchain/mechanics/vesting/vesting.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { CraftEntity } from "./blockchain/mechanics/craft/craft.entity";
import { AssetEntity } from "./blockchain/mechanics/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/mechanics/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/mechanics/asset/asset-component-history.entity";
import { ContractHistoryEntity } from "./blockchain/contract-history/contract-history.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { ReferralRewardEntity } from "./blockchain/mechanics/referral/reward/reward.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { OwnershipEntity } from "./blockchain/tokens/erc998/ownership/ownership.entity";
import { ExchangeHistoryEntity } from "./blockchain/mechanics/exchange/history/exchange-history.entity";
import { WaitlistEntity } from "./blockchain/mechanics/waitlist/waitlist.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    VestingEntity,
    ContractHistoryEntity,
    UserEntity,
    CraftEntity,
    StakingDepositEntity,
    StakingRulesEntity,
    PageEntity,
    ClaimEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    CompositionEntity,
    OwnershipEntity,
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    DropEntity,
    GradeEntity,
    ReferralRewardEntity,
    LotteryRoundEntity,
    LotteryTicketEntity,
    MysteryBoxEntity,
    ExchangeHistoryEntity,
    WaitlistEntity,
    PyramidRulesEntity,
    PyramidDepositEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
