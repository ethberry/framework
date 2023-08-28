import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { NodeEnv } from "@framework/types";

import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryRoundAggregationEntity } from "./blockchain/mechanics/lottery/round/round.aggregation.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/ponzi/deposit/deposit.entity";
import { PonziRulesEntity } from "./blockchain/mechanics/ponzi/rules/rules.entity";
import { WaitListListEntity } from "./blockchain/mechanics/wait-list/list/list.entity";
import { WaitListItemEntity } from "./blockchain/mechanics/wait-list/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
import { PayeesEntity } from "./blockchain/extensions/payment-splitter/payee/payees.entity";
// import { AchievementItemEntity } from "./achievements/item/item.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { AchievementRuleEntity } from "./achievements/rule/rule.entity";
import { AchievementRedemptionEntity } from "./achievements/redemption/redemption.entity";
import { AchievementLevelEntity } from "./achievements/level/level.entity";
import { AchievementItemEntity } from "./achievements/item/item.entity";
import { RaffleRoundEntity } from "./blockchain/mechanics/raffle/round/round.entity";
import { RaffleTicketEntity } from "./blockchain/mechanics/raffle/ticket/ticket.entity";
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
import { DismantleEntity } from "./blockchain/mechanics/recipes/dismantle/dismantle.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    MerchantEntity,
    ChainLinkSubscriptionEntity,
    // Blockchain
    // exchange
    EventHistoryEntity,
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    PayeesEntity,
    // extensions
    AccessControlEntity,
    AccessListEntity,
    // hierarchy
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    CompositionEntity,
    // mechanics
    ClaimEntity,
    BreedEntity,
    DismantleEntity,
    GradeEntity,
    MysteryBoxEntity,
    LotteryRoundEntity,
    LotteryRoundAggregationEntity,
    LotteryTicketEntity,
    RaffleRoundEntity,
    RaffleTicketEntity,
    StakingRulesEntity,
    StakingDepositEntity,
    PonziDepositEntity,
    PonziRulesEntity,
    WaitListListEntity,
    WaitListItemEntity,
    /* achievements */
    AchievementItemEntity,
    AchievementLevelEntity,
    AchievementRuleEntity,
    AchievementRedemptionEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === NodeEnv.development,
};

export default config;
