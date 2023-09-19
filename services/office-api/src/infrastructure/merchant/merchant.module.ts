import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantController } from "./merchant.controller";
import { MerchantUserController } from "./merchant.user.controller";

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([MerchantEntity])],
  providers: [MerchantService],
  controllers: [MerchantController, MerchantUserController],
  exports: [MerchantService],
})
export class MerchantModule {}
