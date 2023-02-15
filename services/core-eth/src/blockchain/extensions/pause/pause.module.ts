import { Module } from "@nestjs/common";

import { PauseControllerEth } from "./pause.controller.eth";
import { PauseServiceEth } from "./pause.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [ContractModule, EventHistoryModule],
  controllers: [PauseControllerEth],
  providers: [PauseServiceEth],
  exports: [PauseServiceEth],
})
export class PauseModule {}
