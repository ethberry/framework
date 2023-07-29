import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { RatePlanModule } from "../../infrastructure/rate-plan/rate-plan.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { ContractManagerController } from "./contract-manager.controller";
import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerService } from "./contract-manager.service";
import { ContractManagerEntity } from "./contract-manager.entity";

@Module({
  imports: [
    ConfigModule,
    RatePlanModule,
    ContractModule,
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([ContractManagerEntity]),
  ],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, ContractManagerSignService, ContractManagerService],
  controllers: [ContractManagerController],
  exports: [ContractManagerSignService, ContractManagerService],
})
export class ContractManagerModule {}
