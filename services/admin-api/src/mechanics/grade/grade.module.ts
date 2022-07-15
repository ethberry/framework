import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GradeEntity } from "./grade.entity";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
