import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { RatePlanModule } from "../../../infrastructure/rate-plan/rate-plan.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractManagerErc721Controller } from "./erc271.controller";
import { ContractManagerErc721SignService } from "./erc271.sign.service";

@Module({
  imports: [ConfigModule, RatePlanModule, ContractModule, SecretManagerModule.deferred()],
  providers: [ethersRpcProvider, ethersSignerProvider, ContractManagerErc721SignService],
  controllers: [ContractManagerErc721Controller],
  exports: [ContractManagerErc721SignService],
})
export class ContractManagerErc721Module {}