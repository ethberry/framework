import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantControllerPrivate } from "./merchant.controller.private";
import { MerchantControllerPublic } from "./merchant.controller.public";

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  providers: [MerchantService],
  controllers: [MerchantControllerPrivate, MerchantControllerPublic],
  exports: [MerchantService],
})
export class MerchantModule {}
