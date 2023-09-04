import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { GradeEntity } from "./grade.entity";
import { GradeService } from "./grade.service";

@Module({
  imports: [ConfigModule, AssetModule, ContractModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
