import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {ns} from "@gemunionstudio/framework-constants-misc";
import path from "path";

import {AuthEntity} from "./auth/auth.entity";
import {CategoryEntity} from "./category/category.entity";
import {MerchantEntity} from "./merchant/merchant.entity";
import {OrderEntity} from "./order/order.entity";
import {PageEntity} from "./page/page.entity";
import {PhotoEntity} from "./photo/photo.entity";
import {ProductEntity} from "./product/product.entity";
import {PromoEntity} from "./promo/promo.entity";
import {TokenEntity} from "./token/token.entity";
import {UserEntity} from "./user/user.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: [
    AuthEntity,
    CategoryEntity,
    MerchantEntity,
    OrderEntity,
    PageEntity,
    PhotoEntity,
    ProductEntity,
    PromoEntity,
    TokenEntity,
    UserEntity,
  ],
  // We are using migrations, synchronize should public-api set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: process.env.NODE_ENV !== "production",
  migrationsTableName: ns,
  migrationsTransactionMode: "each",
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or server folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [path.join(__dirname, "/migrations/**/*{.ts,.js}")],
  cli: {
    // Location of migration should be inside server folder
    // to be compiled into dist/ folder.
    migrationsDir: "server/migrations",
  },
};

export default config;
