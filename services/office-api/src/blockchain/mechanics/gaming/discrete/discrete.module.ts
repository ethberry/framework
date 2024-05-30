import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetModule } from "../../../exchange/asset/asset.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteService } from "./discrete.service";
import { DiscreteController } from "./discrete.controller";

@Module({
  imports: [AssetModule, ContractModule, TokenModule, TypeOrmModule.forFeature([DiscreteEntity])],
  providers: [DiscreteService],
  controllers: [DiscreteController],
  exports: [DiscreteService],
})
export class DiscreteModule {}
