import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GradeEntity } from "./grade.entity";
import { GradeService } from "./grade.service";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
