import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractEntity } from "./contract.entity";
import { ContractSeedService } from "./contract.seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity, MerchantEntity, UserEntity])],
  providers: [ContractSeedService],
  exports: [ContractSeedService],
})
export class ContractSeedModule {}
