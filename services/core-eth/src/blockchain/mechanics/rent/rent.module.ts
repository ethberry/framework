import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { RentEntity } from "./rent.entity";
import { RentService } from "./rent.service";

@Module({
  imports: [AssetModule, ContractModule, TypeOrmModule.forFeature([RentEntity])],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
