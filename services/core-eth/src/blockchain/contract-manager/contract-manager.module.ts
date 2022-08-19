import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerEntity } from "./contract-manager.entity";
import { ContractManagerService } from "./contract-manager.service";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractManagerEntity])],
  providers: [Logger, ContractManagerService],
  exports: [ContractManagerService],
})
export class ContractManagerModule {}
