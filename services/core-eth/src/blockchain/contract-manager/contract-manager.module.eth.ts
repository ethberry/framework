import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { UserModule } from "../../infrastructure/user/user.module";
import { VestingModule } from "../mechanics/marketing/vesting/vesting.module";
import { Erc20TokenLogModule } from "../tokens/erc20/token/log/log.module";
import { Erc721TokenLogModule } from "../tokens/erc721/token/log/log.module";
import { Erc998TokenLogModule } from "../tokens/erc998/token/log/log.module";
import { Erc1155TokenLogModule } from "../tokens/erc1155/token/log/log.module";
import { VestingLogModule } from "../mechanics/marketing/vesting/log/vesting.log.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { EventHistoryModule } from "../event-history/event-history.module";
import { RentModule } from "../mechanics/gaming/rent/rent.module";
import { BalanceModule } from "../hierarchy/balance/balance.module";
import { ClaimModule } from "../mechanics/marketing/claim/claim.module";
import { ContractManagerLogModule } from "./log/log.module";
import { ContractManagerControllerRmq } from "./contract-manager.controller.rmq";
import { ContractManagerServiceRmq } from "./contract-manager.service.rmq";
import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { signalServiceProvider } from "../../common/providers";
import { MysteryLogModule } from "../mechanics/marketing/mystery/box/log/log.module";
import { PonziLogModule } from "../mechanics/gambling/ponzi/log/log.module";
import { StakingLogModule } from "../mechanics/marketing/staking/log/log.module";
import { RaffleLogModule } from "../mechanics/gambling/raffle/log/log.module";
import { LotteryLogModule } from "../mechanics/gambling/lottery/log/log.module";
import { Erc721TokenRandomLogModule } from "../tokens/erc721/token/log-random/log.module";
import { Erc998TokenRandomLogModule } from "../tokens/erc998/token/log-random/log.module";
import { RaffleTicketLogModule } from "../mechanics/gambling/raffle/ticket/log/log.module";
import { LotteryTicketLogModule } from "../mechanics/gambling/lottery/ticket/log/log.module";
import { ChainLinkLogModule } from "../integrations/chain-link/contract/log/log.module";
import { WaitListLogModule } from "../mechanics/marketing/wait-list/log/log.module";
import { PaymentSplitterLogModule } from "../mechanics/meta/payment-splitter/log/log.module";

@Module({
  imports: [
    ConfigModule,
    Erc20TokenLogModule,
    Erc721TokenLogModule,
    Erc721TokenRandomLogModule,
    Erc998TokenLogModule,
    Erc998TokenRandomLogModule,
    Erc1155TokenLogModule,
    MysteryLogModule,
    VestingLogModule,
    StakingLogModule,
    PonziLogModule,
    PaymentSplitterLogModule,
    LotteryLogModule,
    LotteryTicketLogModule,
    RaffleLogModule,
    WaitListLogModule,
    RaffleTicketLogModule,
    ContractManagerLogModule,
    ChainLinkLogModule,
    EventHistoryModule,
    VestingModule,
    ContractModule,
    TemplateModule,
    TokenModule,
    RentModule,
    BalanceModule,
    UserModule,
    ClaimModule,
    SecretManagerModule.deferred(),
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerServiceEth,
    ContractManagerServiceRmq,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerControllerEth, ContractManagerControllerRmq],
  exports: [ContractManagerServiceEth, ContractManagerServiceRmq],
})
export class ContractManagerModuleEth {}
