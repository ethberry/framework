import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";
import { PonziServiceLog } from "./ponzi.service.log";

@Module({
  imports: [ConfigModule, ContractModule, PonziRulesModule, PonziDepositModule, EthersModule.deferred()],
  providers: [PonziServiceLog],
  exports: [PonziServiceLog],
})
export class PonziModule {}
