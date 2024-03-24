import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteService } from "./discrete.service";

@Module({
  imports: [ConfigModule, AssetModule, ContractModule, TypeOrmModule.forFeature([DiscreteEntity])],
  providers: [DiscreteService],
  exports: [DiscreteService],
})
export class DiscreteModule {}
