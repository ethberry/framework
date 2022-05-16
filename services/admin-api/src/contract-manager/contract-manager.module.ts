import { Module } from "@nestjs/common";

import { ContractManagerService } from "./contract-manager.service";
import { ContractManagerController } from "./contract-manager.controller";

@Module({
  providers: [ContractManagerService],
  controllers: [ContractManagerController],
  exports: [ContractManagerService],
})
export class ContractManagerModule {}
