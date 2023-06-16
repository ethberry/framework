import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
