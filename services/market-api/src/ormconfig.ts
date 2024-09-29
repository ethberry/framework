import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// import { NodeEnv } from "@ethberry/constants";

/* infrastructure */
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { PageEntity } from "./infrastructure/page/page.entity";
/* blockchain */
// hierarchy
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
// exchange
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";

// mechanics
import { ClaimEntity } from "./blockchain/mechanics/marketing/claim/claim.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/marketing/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/marketing/staking/deposit/deposit.entity";
import { CraftEntity } from "./blockchain/mechanics/gaming/recipes/craft/craft.entity";
import { DismantleEntity } from "./blockchain/mechanics/gaming/recipes/dismantle/dismantle.entity";
import { AssetPromoEntity } from "./blockchain/mechanics/meta/promo/promo.entity";
import { DiscreteEntity } from "./blockchain/mechanics/gaming/discrete/discrete.entity";
import { ReferralRewardEntity } from "./blockchain/mechanics/meta/referral/reward/reward.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/gambling/lottery/round/round.entity";
import { LotteryRoundAggregationEntity } from "./blockchain/mechanics/gambling/lottery/round/round.aggregation.entity";
import { MergeEntity } from "./blockchain/mechanics/gaming/recipes/merge/merge.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/marketing/mystery/box/box.entity";
import { LootBoxEntity } from "./blockchain/mechanics/marketing/loot/box/box.entity";
import { WaitListListEntity } from "./blockchain/mechanics/marketing/wait-list/list/list.entity";
import { WaitListItemEntity } from "./blockchain/mechanics/marketing/wait-list/item/item.entity";
import { PonziRulesEntity } from "./blockchain/mechanics/gambling/ponzi/rules/rules.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/gambling/ponzi/deposit/deposit.entity";
import { BreedEntity } from "./blockchain/mechanics/gaming/breed/breed.entity";
import { PredictionAnswerEntity } from "./blockchain/mechanics/gambling/prediction/answer/answer.entity";
import { PredictionQuestionEntity } from "./blockchain/mechanics/gambling/prediction/question/question.entity";
// extensions
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
// integrations
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
/* ecommerce */
import { OrderEntity } from "./ecommerce/order/order.entity";
import { ProductEntity } from "./ecommerce/product/product.entity";
import { ProductPromoEntity } from "./ecommerce/promo/promo.entity";
import { PhotoEntity } from "./ecommerce/photo/photo.entity";
import { NetworkEntity } from "./infrastructure/network/network.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
import { AddressEntity } from "./ecommerce/address/address.entity";
import { OrderItemEntity } from "./ecommerce/order-item/order-item.entity";
import { CategoryEntity } from "./ecommerce/category/category.entity";
import { CartEntity } from "./ecommerce/cart/cart.entity";
import { CartItemEntity } from "./ecommerce/cart-item/cart-item.entity";
import { RentEntity } from "./blockchain/mechanics/gaming/rent/rent.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { AchievementItemEntity } from "./blockchain/mechanics/meta/achievements/item/item.entity";
import { AchievementLevelEntity } from "./blockchain/mechanics/meta/achievements/level/level.entity";
import { AchievementRuleEntity } from "./blockchain/mechanics/meta/achievements/rule/rule.entity";
import { AchievementRedemptionEntity } from "./blockchain/mechanics/meta/achievements/redemption/redemption.entity";
import { ProductItemEntity } from "./ecommerce/product-item/product-item.entity";
import { ParameterEntity } from "./ecommerce/parameter/parameter.entity";
import { CustomParameterEntity } from "./ecommerce/custom-parameter/custom-parameter.entity";
import { RaffleRoundEntity } from "./blockchain/mechanics/gambling/raffle/round/round.entity";
import { ReferralProgramEntity } from "./blockchain/mechanics/meta/referral/program/referral.program.entity";
import { ReferralClaimEntity } from "./blockchain/mechanics/meta/referral/claim/referral.claim.entity";
import { ReferralRewardShareEntity } from "./blockchain/mechanics/meta/referral/reward/share/referral.reward.share.entity";
import { ReferralTreeEntity } from "./blockchain/mechanics/meta/referral/program/tree/referral.tree.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    /* infrastructure */
    OtpEntity,
    PageEntity,
    MerchantEntity,
    SettingsEntity,
    UserEntity,
    /* blockchain */
    // hierarchy
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    CompositionEntity,

    // exchange
    EventHistoryEntity,
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    ReferralRewardEntity,
    ReferralProgramEntity,
    ReferralClaimEntity,
    ReferralRewardShareEntity,
    ReferralTreeEntity,

    // mechanics
    CraftEntity,
    StakingDepositEntity,
    StakingRulesEntity,
    ClaimEntity,
    DismantleEntity,
    AssetPromoEntity,
    DiscreteEntity,
    LotteryRoundEntity,
    LotteryRoundAggregationEntity,
    MergeEntity,
    RaffleRoundEntity,
    LootBoxEntity,
    MysteryBoxEntity,
    WaitListListEntity,
    WaitListItemEntity,
    PonziRulesEntity,
    PonziDepositEntity,
    BreedEntity,
    RentEntity,
    PredictionAnswerEntity,
    PredictionQuestionEntity,
    // extensions
    AccessControlEntity,
    // integrations
    ChainLinkSubscriptionEntity,
    /* ecommerce */
    AddressEntity,
    CategoryEntity,
    MerchantEntity,
    NetworkEntity,
    OrderEntity,
    OrderItemEntity,
    PhotoEntity,
    ProductEntity,
    ProductItemEntity,
    ParameterEntity,
    CustomParameterEntity,
    ProductPromoEntity,
    CartEntity,
    CartItemEntity,
    /* achievement */
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
