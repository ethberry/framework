import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule, ethersRpcProvider } from "@ethberry/nest-js-module-ethers-gcp";

import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";

import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { signalServiceProvider } from "../../../../../common/providers";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { RaffleRoundModule } from "../round/round.module";
import { RaffleTicketControllerEth } from "./ticket.controller.eth";
import { RaffleTokenService } from "./token.service";
import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { RaffleTicketServiceLog } from "./ticket.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    AssetModule,
    TemplateModule,
    BalanceModule,
    RaffleRoundModule,
    EventHistoryModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [
    Logger,
    signalServiceProvider,
    ethersRpcProvider,
    RaffleTokenService,
    RaffleTicketServiceLog,
    RaffleTicketServiceEth,
  ],
  controllers: [RaffleTicketControllerEth],
  exports: [RaffleTokenService, RaffleTicketServiceLog, RaffleTicketServiceEth],
})
export class RaffleTicketModule implements OnModuleInit {
  constructor(private readonly raffleTicketServiceLog: RaffleTicketServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.raffleTicketServiceLog.updateRegistry();
  }
}
