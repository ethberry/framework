import { Logger, Module } from "@nestjs/common";

import { PauseControllerEth } from "./pause.controller.eth";
import { PauseServiceEth } from "./pause.service.eth";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { ContractHistoryModule } from "../contract-history/contract-history.module";

@Module({
  imports: [ContractModule, ContractHistoryModule],
  controllers: [PauseControllerEth],
  providers: [Logger, PauseServiceEth],
  exports: [PauseServiceEth],
})
export class PauseModule {}
