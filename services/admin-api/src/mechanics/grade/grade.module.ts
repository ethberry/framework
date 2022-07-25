import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GradeEntity } from "./grade.entity";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
