import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ContractManagerService } from "./contract-manager.service";
import { ContractManagerController } from "./contract-manager.controller";

@Module({
  imports: [ConfigModule],
  providers: [ethersRpcProvider, ethersSignerProvider, ContractManagerService],
  controllers: [ContractManagerController],
  exports: [ContractManagerService],
})
export class ContractManagerModule {}
