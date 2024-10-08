import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { ClaimEntity } from "./blockchain/mechanics/marketing/claim/claim.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/marketing/mystery/box/box.entity";
import { LootBoxEntity } from "./blockchain/mechanics/marketing/loot/box/box.entity";
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/marketing/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/marketing/staking/deposit/deposit.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { DiscreteEntity } from "./blockchain/mechanics/gaming/discrete/discrete.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/gambling/lottery/round/round.entity";
import { LotteryRoundAggregationEntity } from "./blockchain/mechanics/gambling/lottery/round/round.aggregation.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/gambling/lottery/ticket/ticket.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/gambling/ponzi/deposit/deposit.entity";
import { PonziRulesEntity } from "./blockchain/mechanics/gambling/ponzi/rules/rules.entity";
import { WaitListListEntity } from "./blockchain/mechanics/marketing/wait-list/list/list.entity";
import { WaitListItemEntity } from "./blockchain/mechanics/marketing/wait-list/item/item.entity";
import { BreedEntity } from "./blockchain/mechanics/gaming/breed/breed.entity";
import { PayeesEntity } from "./blockchain/extensions/payment-splitter/payee/payees.entity";
// import { AchievementItemEntity } from "./achievements/item/item.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { AchievementRuleEntity } from "./blockchain/mechanics/meta/achievements/rule/rule.entity";
import { AchievementRedemptionEntity } from "./blockchain/mechanics/meta/achievements/redemption/redemption.entity";
import { AchievementLevelEntity } from "./blockchain/mechanics/meta/achievements/level/level.entity";
import { AchievementItemEntity } from "./blockchain/mechanics/meta/achievements/item/item.entity";
import { RaffleRoundEntity } from "./blockchain/mechanics/gambling/raffle/round/round.entity";
import { RaffleTicketEntity } from "./blockchain/mechanics/gambling/raffle/ticket/ticket.entity";
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
import { DismantleEntity } from "./blockchain/mechanics/gaming/recipes/dismantle/dismantle.entity";
import { CraftEntity } from "./blockchain/mechanics/gaming/recipes/craft/craft.entity";
import { MergeEntity } from "./blockchain/mechanics/gaming/recipes/merge/merge.entity";
import { StakingPenaltyEntity } from "./blockchain/mechanics/marketing/staking/penalty/penalty.entity";
import { ReferralRewardEntity } from "./blockchain/mechanics/meta/referral/reward/referral.reward.entity";
import { ReferralTreeEntity } from "./blockchain/mechanics/meta/referral/program/tree/referral.tree.entity";
import { ReferralProgramEntity } from "./blockchain/mechanics/meta/referral/program/referral.program.entity";
import { ReferralClaimEntity } from "./blockchain/mechanics/meta/referral/claim/referral.claim.entity";
import { ReferralRewardShareEntity } from "./blockchain/mechanics/meta/referral/reward/share/referral.reward.share.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    MerchantEntity,
    SettingsEntity,
    // Blockchain
    ChainLinkSubscriptionEntity,
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
    CraftEntity,
    MergeEntity,
    DismantleEntity,
    DiscreteEntity,
    MysteryBoxEntity,
    LootBoxEntity,
    LotteryRoundEntity,
    LotteryRoundAggregationEntity,
    LotteryTicketEntity,
    RaffleRoundEntity,
    RaffleTicketEntity,
    StakingRulesEntity,
    StakingDepositEntity,
    StakingPenaltyEntity,
    PonziDepositEntity,
    PonziRulesEntity,
    WaitListListEntity,
    WaitListItemEntity,
    ReferralRewardEntity,
    ReferralTreeEntity,
    ReferralProgramEntity,
    ReferralClaimEntity,
    ReferralRewardShareEntity,
    AchievementItemEntity,
    AchievementLevelEntity,
    AchievementRuleEntity,
    AchievementRedemptionEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.LOG_MODE === "true",
};

export default config;
