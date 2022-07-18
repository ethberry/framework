import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { GradeEntity } from "./grade.entity";
import { SignerModule } from "../signer/signer.module";

@Module({
  imports: [SignerModule, TokenModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [Logger, GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
