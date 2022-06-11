import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ContractManagerController } from "./contract-manager.controller";
import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerService } from "./contract-manager.service";
import { ContractManagerEntity } from "./contract-manager.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractManagerEntity])],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, ContractManagerSignService, ContractManagerService],
  controllers: [ContractManagerController],
  exports: [ContractManagerSignService, ContractManagerService],
})
export class ContractManagerModule {}
