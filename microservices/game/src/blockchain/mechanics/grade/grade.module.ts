import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { GradeEntity } from "./grade.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TokenModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
