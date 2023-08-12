import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantController } from "./merchant.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([MerchantEntity])],
  providers: [MerchantService],
  controllers: [MerchantController],
  exports: [MerchantService],
})
export class MerchantModule {}
