import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetModule } from "../../exchange/asset/asset.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { GradeEntity } from "./grade.entity";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";

@Module({
  imports: [AssetModule, ContractModule, TokenModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
