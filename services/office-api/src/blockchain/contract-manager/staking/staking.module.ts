import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { RatePlanModule } from "../../../infrastructure/rate-plan/rate-plan.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractManagerStakingController } from "./staking.controller";
import { ContractManagerStakingSignService } from "./staking.sign.service";

@Module({
  imports: [ConfigModule, RatePlanModule, ContractModule, SecretManagerModule.deferred()],
  providers: [ethersRpcProvider, ethersSignerProvider, ContractManagerStakingSignService],
  controllers: [ContractManagerStakingController],
  exports: [ContractManagerStakingSignService],
})
export class ContractManagerStakingModule {}
