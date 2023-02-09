import { Module } from "@nestjs/common";

import { PauseControllerEth } from "./pause.controller.eth";
import { PauseServiceEth } from "./pause.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractHistoryModule } from "../../hierarchy/contract/history/history.module";

@Module({
  imports: [ContractModule, ContractHistoryModule],
  controllers: [PauseControllerEth],
  providers: [PauseServiceEth],
  exports: [PauseServiceEth],
})
export class PauseModule {}
