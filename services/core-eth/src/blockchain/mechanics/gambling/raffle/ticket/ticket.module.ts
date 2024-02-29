import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { RaffleRoundModule } from "../round/round.module";
import { RaffleTicketControllerEth } from "./ticket.controller.eth";
import { RaffleTicketLogModule } from "./log/log.module";
import { RaffleTokenService } from "./token.service";
import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { signalServiceProvider } from "../../../../../common/providers";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";

@Module({
  imports: [
    ConfigModule,
    RaffleTicketLogModule,
    ContractModule,
    TokenModule,
    AssetModule,
    TemplateModule,
    BalanceModule,
    RaffleRoundModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, signalServiceProvider, ethersRpcProvider, RaffleTokenService, RaffleTicketServiceEth],
  controllers: [RaffleTicketControllerEth],
  exports: [RaffleTokenService, RaffleTicketServiceEth],
})
export class RaffleTicketModule {}
