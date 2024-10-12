import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { PauseControllerEth } from "./pause.controller.eth";
import { PauseServiceEth } from "./pause.service.eth";
import { PauseServiceLog } from "./pause.service.log";

@Module({
  imports: [ContractModule, EventHistoryModule, ConfigModule, EthersModule.deferred()],
  controllers: [PauseControllerEth],
  providers: [signalServiceProvider, PauseServiceLog, PauseServiceEth],
  exports: [PauseServiceLog, PauseServiceEth],
})
export class PauseModule implements OnModuleInit {
  constructor(private readonly pauseServiceLog: PauseServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.pauseServiceLog.updateRegistry();
  }
}
