import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

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
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { ClaimEntity } from "./blockchain/mechanics/claim/claim.entity";
import { PageEntity } from "./infrastructure/page/page.entity";
import { DropEntity } from "./blockchain/mechanics/drop/drop.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { EventHistoryEntity } from "./blockchain/event-history/event-history.entity";
import { PyramidDepositEntity } from "./blockchain/mechanics/pyramid/deposit/deposit.entity";
import { PyramidRulesEntity } from "./blockchain/mechanics/pyramid/rules/rules.entity";
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

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
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
    PyramidDepositEntity,
    PyramidRulesEntity,
    /* infrastructure */
    OtpEntity,
    UserEntity,
    SettingsEntity,
    RatePlanEntity,
    PageEntity,
    MerchantEntity,
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
  ],
  // We are using migrations, synchronize should market-api set to false.
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
