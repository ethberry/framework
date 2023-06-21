import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { RaffleRoundModule } from "../round/round.module";
import { RaffleTicketControllerEth } from "./ticket.controller.eth";
import { RaffleTicketEntity } from "./ticket.entity";
import { RaffleTicketLogModule } from "./log/log.module";
import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketServiceEth } from "./ticket.service.eth";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

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
    TypeOrmModule.forFeature([RaffleTicketEntity]),
  ],
  providers: [Logger, ethersRpcProvider, RaffleTicketService, RaffleTicketServiceEth],
  controllers: [RaffleTicketControllerEth],
  exports: [RaffleTicketService, RaffleTicketServiceEth],
})
export class RaffleTicketModule {}
