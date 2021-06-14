import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {ConnectionOptions} from "typeorm";

import {MerchantEntity} from "./merchant/merchant.entity";
import {PhotoEntity} from "./photo/photo.entity";
import {ProductEntity} from "./product/product.entity";
import {PromoEntity} from "./promo/promo.entity";
import {TokenEntity} from "./token/token.entity";
import {UserEntity} from "./user/user.entity";
import {AuthEntity} from "./auth/auth.entity";

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [AuthEntity, MerchantEntity, PhotoEntity, ProductEntity, PromoEntity, TokenEntity, UserEntity],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
};

export default config;
