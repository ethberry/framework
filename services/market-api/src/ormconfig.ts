import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

/* infrastructure */
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { PageEntity } from "./infrastructure/page/page.entity";
/* blockchain */
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
import { CraftEntity } from "./blockchain/mechanics/craft/craft.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { ReferralRewardEntity } from "./blockchain/mechanics/referral/reward/reward.entity";
import { LotteryRoundEntity } from "./blockchain/mechanics/lottery/round/round.entity";
import { LotteryTicketEntity } from "./blockchain/mechanics/lottery/ticket/ticket.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
import { OwnershipEntity } from "./blockchain/tokens/erc998/ownership/ownership.entity";
import { WaitlistListEntity } from "./blockchain/mechanics/waitlist/list/list.entity";
import { WaitlistItemEntity } from "./blockchain/mechanics/waitlist/item/item.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";
import { BreedEntity } from "./blockchain/mechanics/breed/breed.entity";
/* ecommerce */
import { OrderEntity } from "./ecommerce/order/order.entity";
import { ProductEntity } from "./ecommerce/product/product.entity";
import { PromoEntity } from "./ecommerce/promo/promo.entity";
import { PhotoEntity } from "./ecommerce/photo/photo.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
import { AddressEntity } from "./ecommerce/address/address.entity";
import { OrderItemEntity } from "./ecommerce/order-item/order-item.entity";
import { CategoryEntity } from "./ecommerce/category/category.entity";
import { CartEntity } from "./ecommerce/cart/cart.entity";
import { CartItemEntity } from "./ecommerce/cart-item/cart-item.entity";
import { RentEntity } from "./blockchain/mechanics/rent/rent.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { AchievementItemEntity } from "./achievements/item/item.entity";
import { AchievementLevelEntity } from "./achievements/level/level.entity";
import { AchievementRuleEntity } from "./achievements/rule/rule.entity";

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
    EventHistoryEntity,
    CraftEntity,
    StakingDepositEntity,
    StakingRulesEntity,
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
    WaitlistListEntity,
    WaitlistItemEntity,
    PyramidRulesEntity,
    PyramidDepositEntity,
    BreedEntity,
    RentEntity,
    /* ecommerce */
    AddressEntity,
    CategoryEntity,
    MerchantEntity,
    OrderEntity,
    OrderItemEntity,
    PhotoEntity,
    ProductEntity,
    PromoEntity,
    CartEntity,
    CartItemEntity,
    /* achievement */
    AchievementItemEntity,
    AchievementLevelEntity,
    AchievementRuleEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
