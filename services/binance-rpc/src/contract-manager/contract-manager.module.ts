import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerController } from "./contract-manager.controller";
import { ContractManagerService } from "./contract-manager.service";

import { ContractManagerEntity } from "./contract-manager.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractManagerEntity])],
  providers: [Logger, ContractManagerService],
  controllers: [ContractManagerController],
  exports: [ContractManagerService],
})
export class ContractManagerModule {}
