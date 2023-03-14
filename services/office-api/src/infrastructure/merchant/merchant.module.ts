import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantController } from "./merchant.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  providers: [MerchantService],
  controllers: [MerchantController],
  exports: [MerchantService],
})
export class MerchantModule {}
