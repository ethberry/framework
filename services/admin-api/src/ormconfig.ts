import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@gemunion/framework-constants";

import { AuthEntity } from "./auth/auth.entity";
import { CategoryEntity } from "./category/category.entity";
import { MerchantEntity } from "./merchant/merchant.entity";
import { OrderEntity } from "./order/order.entity";
import { PageEntity } from "./page/page.entity";
import { PhotoEntity } from "./photo/photo.entity";
import { ProductEntity } from "./product/product.entity";
import { PromoEntity } from "./promo/promo.entity";
import { OtpEntity } from "./otp/otp.entity";
import { UserEntity } from "./user/user.entity";
import { CreateSchema1561991006215 } from "./migrations/1561991006215-create-schema";
import { CreateLanguageEnum1561991006225 } from "./migrations/1561991006225-create-language-enum";
import { InstallExtension1561991006333 } from "./migrations/1561991006333-install-extension";
import { CreateMerchantTable1563804021000 } from "./migrations/1563804021000-create-merchant-table";
import { SeedMerchant1563804021010 } from "./migrations/1563804021010-seed-merchant";
import { CreateUserTable1563804021040 } from "./migrations/1563804021040-create-user-table";
import { SeedUser1563804021050 } from "./migrations/1563804021050-seed-user";
import { CreateOtpTable1563804021060 } from "./migrations/1563804021060-create-otp-table";
import { CreateAuthTable1563804021070 } from "./migrations/1563804021070-create-auth-table";
import { CreateCategoryTable1591673187606 } from "./migrations/1593408358850-create-category-table";
import { SeedCategory1593408358860 } from "./migrations/1593408358860-seed-category";
import { CreateProductTable1593408358900 } from "./migrations/1593408358900-create-product-table";
import { SeedProducts1593408358910 } from "./migrations/1593408358910-seed-product";
import { CreateProductToCategoryTable1593408358915 } from "./migrations/1593408358915-create-product-to-category-table";
import { SeedProductToCategory1593408358916 } from "./migrations/1593408358916-seed-product-to-category";
import { CreatePhotoTable1593408358920 } from "./migrations/1593408358920-create-photo-table";
import { SeedPhoto1593408358930 } from "./migrations/1593408358930-seed-photo";
import { CreateOrderTable1593490663230 } from "./migrations/1593490663230-create-order-table";
import { SeedOrders1593490663240 } from "./migrations/1593490663240-seed-order";
import { CreatePromoTable1600996093684 } from "./migrations/1600996093684-create-promo-table";
import { SeedPromo1600996093694 } from "./migrations/1600996093694-seed-promo";
import { CreatePageTable1625271343228 } from "./migrations/1625271343228-create-page-table";
import { SeedPages1625271372897 } from "./migrations/1625271372897-seed-pages";

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
    OtpEntity,
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
  migrations: [
    CreateSchema1561991006215,
    CreateLanguageEnum1561991006225,
    InstallExtension1561991006333,
    CreateMerchantTable1563804021000,
    SeedMerchant1563804021010,
    CreateUserTable1563804021040,
    SeedUser1563804021050,
    CreateOtpTable1563804021060,
    CreateAuthTable1563804021070,
    CreateCategoryTable1591673187606,
    SeedCategory1593408358860,
    CreateProductTable1593408358900,
    SeedProducts1593408358910,
    CreateProductToCategoryTable1593408358915,
    SeedProductToCategory1593408358916,
    CreatePhotoTable1593408358920,
    SeedPhoto1593408358930,
    CreateOrderTable1593490663230,
    SeedOrders1593490663240,
    CreatePromoTable1600996093684,
    SeedPromo1600996093694,
    CreatePageTable1625271343228,
    SeedPages1625271372897,
  ],
};

export default config;
