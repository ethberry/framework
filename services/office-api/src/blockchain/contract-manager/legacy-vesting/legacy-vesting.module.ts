import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { RatePlanModule } from "../../../infrastructure/rate-plan/rate-plan.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractManagerLegacyVestingController } from "./legacy-vesting.controller";
import { ContractManagerVestingSignService } from "./legacy-vesting.sign.service";

@Module({
  imports: [ConfigModule, RatePlanModule, ContractModule, SecretManagerModule.deferred()],
  providers: [ethersRpcProvider, ethersSignerProvider, ContractManagerVestingSignService],
  controllers: [ContractManagerLegacyVestingController],
  exports: [ContractManagerVestingSignService],
})
export class ContractManagerLegacyVestingModule {}
