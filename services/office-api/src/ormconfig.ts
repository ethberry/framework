import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { NodeEnv } from "@framework/types";

// contract-manager
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
// hierarchy
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { CompositionEntity } from "./blockchain/tokens/erc998/composition/composition.entity";
// extensions
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
// infrastructure
import { PageEntity } from "./infrastructure/page/page.entity";
import { AssetPromoEntity } from "./blockchain/mechanics/promo/promo.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { UserEntity } from "./infrastructure/user/user.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
// exchange
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
// integrations
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
// mechanics
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";
import { WaitListItemEntity } from "./blockchain/mechanics/wait-list/item/item.entity";
import { WaitListListEntity } from "./blockchain/mechanics/wait-list/list/list.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/ponzi/deposit/deposit.entity";
import { PonziRulesEntity } from "./blockchain/mechanics/ponzi/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { MysteryBoxEntity } from "./blockchain/mechanics/mystery/box/box.entity";
// infrastructure
import { RatePlanEntity } from "./infrastructure/rate-plan/rate-plan.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
/* ecommerce */
import { ProductPromoEntity } from "./ecommerce/promo/promo.entity";
import { StockEntity } from "./ecommerce/stock/stock.entity";
import { ProductItemParameterEntity } from "./ecommerce/product-item-parameter/product-item-parameter.entity";
import { ProductItemEntity } from "./ecommerce/product-item/product-item.entity";
import { CategoryEntity } from "./ecommerce/category/category.entity";
import { AddressEntity } from "./ecommerce/address/address.entity";
import { OrderEntity } from "./ecommerce/order/order.entity";
import { OrderItemEntity } from "./ecommerce/order-item/order-item.entity";
import { ParameterEntity } from "./ecommerce/parameter/parameter.entity";
import { PhotoEntity } from "./ecommerce/photo/photo.entity";
import { ProductEntity } from "./ecommerce/product/product.entity";
/* achievements */
import { AchievementItemEntity } from "./achievements/item/item.entity";
import { AchievementLevelEntity } from "./achievements/level/level.entity";
import { AchievementRuleEntity } from "./achievements/rule/rule.entity";
import { AchievementRedemptionEntity } from "./achievements/redemption/redemption.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    ContractManagerEntity,
    // exchange
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    // extensions
    AccessControlEntity,
    AccessListEntity,
    // hierarchy
    ContractEntity,
    TemplateEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    CompositionEntity,
    // mechanics
    MysteryBoxEntity,
    GradeEntity,
    ClaimEntity,
    AssetPromoEntity,
    EventHistoryEntity,
    StakingDepositEntity,
    StakingRulesEntity,
    PonziDepositEntity,
    PonziRulesEntity,
    WaitListItemEntity,
    WaitListListEntity,
    /* infrastructure */
    OtpEntity,
    UserEntity,
    SettingsEntity,
    RatePlanEntity,
    PageEntity,
    MerchantEntity,
    ChainLinkSubscriptionEntity,
    /* ecommerce */
    AddressEntity,
    CategoryEntity,
    OrderEntity,
    OrderItemEntity,
    PhotoEntity,
    ProductEntity,
    ProductPromoEntity,
    ParameterEntity,
    ProductItemEntity,
    ProductItemParameterEntity,
    StockEntity,
    /* achievements */
    AchievementItemEntity,
    AchievementLevelEntity,
    AchievementRuleEntity,
    AchievementRedemptionEntity,
  ],
  // We are using migrations, synchronize should market-api set to false.
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === NodeEnv.development,
};

export default config;
