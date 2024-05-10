import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../infrastructure/settings/settings.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { DiscreteService } from "./discrete.service";
import { DiscreteController } from "./discrete.controller";
import { DiscreteEntity } from "./discrete.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TokenModule, TypeOrmModule.forFeature([DiscreteEntity])],
  providers: [DiscreteService],
  controllers: [DiscreteController],
  exports: [DiscreteService],
})
export class DiscreteModule {}
