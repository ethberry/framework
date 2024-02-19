import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { MergeService } from "./merge.service";
import { MergeEntity } from "./merge.entity";
import { MergeController } from "./merge.controller";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TokenModule, TypeOrmModule.forFeature([MergeEntity])],
  providers: [MergeService],
  controllers: [MergeController],
  exports: [MergeService],
})
export class MergeModule {}
