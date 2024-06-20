import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "./contract.entity";
import { ContractSeedService } from "./contract.seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity, UserEntity, MerchantEntity])],
  providers: [ContractSeedService],
  exports: [ContractSeedService],
})
export class ContractSeedModule {}
