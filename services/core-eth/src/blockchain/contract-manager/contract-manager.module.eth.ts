import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { VestingModule } from "../mechanics/vesting/vesting.module";
import { Erc20TokenLogModule } from "../tokens/erc20/token/log/log.module";
import { Erc721TokenLogModule } from "../tokens/erc721/token/log/log.module";
import { Erc998TokenLogModule } from "../tokens/erc998/token/log/log.module";
import { Erc1155TokenLogModule } from "../tokens/erc1155/token/log/log.module";
import { VestingLogModule } from "../mechanics/vesting/log/vesting.log.module";
import { ContractManagerLogModule } from "./log/log.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { GradeModule } from "../mechanics/grade/grade.module";
import { MysteryLogModule } from "../mechanics/mystery/box/log/log.module";
import { PyramidLogModule } from "../mechanics/pyramid/log/log.module";
import { ContractManagerControllerRmq } from "./contract-manager.controller.rmq";
import { ContractManagerServiceRmq } from "./contract-manager.service.rmq";
import { BalanceModule } from "../hierarchy/balance/balance.module";
import { StakingLogModule } from "../mechanics/staking/log/log.module";
import { EventHistoryModule } from "../event-history/event-history.module";
import { RentModule } from "../mechanics/rent/rent.module";
import { RaffleLogModule } from "../mechanics/raffle/log/log.module";
import { LotteryLogModule } from "../mechanics/lottery/log/log.module";

@Module({
  imports: [
    ConfigModule,
    Erc20TokenLogModule,
    Erc721TokenLogModule,
    Erc998TokenLogModule,
    Erc1155TokenLogModule,
    MysteryLogModule,
    VestingLogModule,
    StakingLogModule,
    PyramidLogModule,
    LotteryLogModule,
    RaffleLogModule,
    ContractManagerLogModule,
    EventHistoryModule,
    VestingModule,
    ContractModule,
    TemplateModule,
    TokenModule,
    GradeModule,
    RentModule,
    BalanceModule,
  ],
  providers: [Logger, ContractManagerServiceEth, ContractManagerServiceRmq, ethersSignerProvider, ethersRpcProvider],
  controllers: [ContractManagerControllerEth, ContractManagerControllerRmq],
  exports: [ContractManagerServiceEth, ContractManagerServiceRmq],
})
export class ContractManagerModuleEth {}
