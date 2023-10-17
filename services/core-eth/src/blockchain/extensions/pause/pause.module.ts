import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PauseControllerEth } from "./pause.controller.eth";
import { PauseServiceEth } from "./pause.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ContractModule, EventHistoryModule, ConfigModule],
  controllers: [PauseControllerEth],
  providers: [signalServiceProvider, PauseServiceEth],
  exports: [PauseServiceEth],
})
export class PauseModule {}
