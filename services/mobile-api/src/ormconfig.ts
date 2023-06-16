import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { UserEntity } from "./infrastructure/user/user.entity";
import { OtpEntity } from "./infrastructure/otp/otp.entity";
import { MerchantEntity } from "./infrastructure/merchant/merchant.entity";
import { BalanceEntity } from "./game/balance/balance.entity";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    /* infrastructure */
    OtpEntity,
    UserEntity,
    MerchantEntity,
    /* game */
    BalanceEntity,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging",
};

export default config;
