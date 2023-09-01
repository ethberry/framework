import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { NodeEnv } from "@framework/types";

import { UserEntity } from "./infrastructure/user/user.entity";
import { SettingsEntity } from "./infrastructure/settings/settings.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { ContractEntity } from "./blockchain/hierarchy/contract/contract.entity";
import { TemplateEntity } from "./blockchain/hierarchy/template/template.entity";
import { TokenEntity } from "./blockchain/hierarchy/token/token.entity";
import { BalanceEntity } from "./blockchain/hierarchy/balance/balance.entity";
import { AssetEntity } from "./blockchain/exchange/asset/asset.entity";
import { AssetComponentEntity } from "./blockchain/exchange/asset/asset-component.entity";
import { AssetComponentHistoryEntity } from "./blockchain/exchange/asset/asset-component-history.entity";
import { AccessControlEntity } from "./blockchain/extensions/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/extensions/access-list/access-list.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { PageEntity } from "./infrastructure/page/page.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { PonziDepositEntity } from "./blockchain/mechanics/ponzi/deposit/deposit.entity";
import { PonziRulesEntity } from "./blockchain/mechanics/ponzi/rules/rules.entity";
import { StakingDepositEntity } from "./blockchain/mechanics/staking/deposit/deposit.entity";
import { StakingRulesEntity } from "./blockchain/mechanics/staking/rules/rules.entity";
import { OrderEntity } from "./ecommerce/order/order.entity";
import { ProductEntity } from "./ecommerce/product/product.entity";
import { PromoEntity } from "./ecommerce/promo/promo.entity";
import { PhotoEntity } from "./ecommerce/photo/photo.entity";
import { AddressEntity } from "./ecommerce/address/address.entity";
import { OrderItemEntity } from "./ecommerce/order-item/order-item.entity";
import { CategoryEntity } from "./ecommerce/category/category.entity";
import { ProductItemEntity } from "./ecommerce/product-item/product-item.entity";
import { ProductItemParameterEntity } from "./ecommerce/product-item-parameter/product-item-parameter.entity";
import { StockEntity } from "./ecommerce/stock/stock.entity";
import { ParameterEntity } from "./ecommerce/parameter/parameter.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
import { RatePlanEntity } from "./infrastructure/rate-plan/rate-plan.entity";
import { ChainLinkSubscriptionEntity } from "./blockchain/integrations/chain-link/subscription/subscription.entity";
import { GradeEntity } from "./blockchain/mechanics/grade/grade.entity";

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
    GradeEntity,
    ContractManagerEntity,
    AccessControlEntity,
    AccessListEntity,
    ContractEntity,
    TemplateEntity,
    AssetEntity,
    AssetComponentEntity,
    AssetComponentHistoryEntity,
    ContractEntity,
    TemplateEntity,
    TokenEntity,
    BalanceEntity,
    ClaimEntity,
    DropEntity,
    EventHistoryEntity,
    StakingDepositEntity,
    StakingRulesEntity,
    PonziDepositEntity,
    PonziRulesEntity,
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
    PromoEntity,
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
