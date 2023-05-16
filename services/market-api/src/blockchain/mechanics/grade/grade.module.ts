import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { GradeEntity } from "./grade.entity";

@Module({
  imports: [SettingsModule, SignerModule, TokenModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [Logger, GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
