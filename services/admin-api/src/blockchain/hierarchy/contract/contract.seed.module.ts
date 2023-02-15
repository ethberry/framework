import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "./contract.entity";

import { ContractSeedService } from "./contract.seed.service";
import { UserEntity } from "../../../ecommerce/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity, UserEntity])],
  providers: [ContractSeedService],
  exports: [ContractSeedService],
})
export class ContractSeedModule {}
