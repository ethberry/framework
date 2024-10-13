import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { signalServiceProvider } from "../../common/providers";
import { UserModule } from "../../infrastructure/user/user.module";
import { VestingModule } from "../mechanics/marketing/vesting/vesting.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { EventHistoryModule } from "../event-history/event-history.module";
import { RentableModule } from "../mechanics/gaming/rentable/rentable.module";
import { BalanceModule } from "../hierarchy/balance/balance.module";
import { ClaimModule } from "../mechanics/marketing/claim/claim.module";
import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";
import { Erc20TokenModule } from "../tokens/erc20/token/token.module";
import { Erc721TokenModule } from "../tokens/erc721/token/token.module";
import { ContractManagerServiceLog } from "./contract-manager.service.log";
import { Erc1155TokenModule } from "../tokens/erc1155/token/token.module";
import { Erc998TokenModule } from "../tokens/erc998/token/token.module";
import { LotteryTicketModule } from "../mechanics/gambling/lottery/ticket/ticket.module";
import { RaffleTicketModule } from "../mechanics/gambling/raffle/ticket/ticket.module";
import { PaymentSplitterModule } from "../mechanics/meta/payment-splitter/payment-splitter.module";
import { MysteryBoxModule } from "../mechanics/marketing/mystery/box/box.module";
import { LootBoxModule } from "../mechanics/marketing/loot/box/box.module";
import { PonziModule } from "../mechanics/gambling/ponzi/ponzi.module";
import { StakingContractModule } from "../mechanics/marketing/staking/contract/contract.module";
import { LotteryRoundModule } from "../mechanics/gambling/lottery/round/round.module";
import { RaffleRoundModule } from "../mechanics/gambling/raffle/round/round.module";
import { WaitListListModule } from "../mechanics/marketing/wait-list/list/list.module";
import { ContractManagerErc20Module } from "./erc20/erc20.module";
import { ContractManagerErc721Module } from "./erc721/erc721.module";
import { ContractManagerErc998Module } from "./erc998/erc998.module";

@Module({
  imports: [
    ContractManagerErc20Module,
    ContractManagerErc721Module,
    ContractManagerErc998Module,

    ConfigModule,
    EthersModule.deferred(),
    ContractModule,
    EventHistoryModule,
    VestingModule,
    TemplateModule,
    TokenModule,
    RentableModule,
    BalanceModule,
    UserModule,
    ClaimModule,
    SecretManagerModule.deferred(),
    Erc20TokenModule,
    Erc721TokenModule,
    Erc998TokenModule,
    Erc1155TokenModule,
    MysteryBoxModule,
    LootBoxModule,
    LotteryRoundModule,
    LotteryTicketModule,
    RaffleRoundModule,
    RaffleTicketModule,
    PonziModule,
    StakingContractModule,
    VestingModule,
    PaymentSplitterModule,
    WaitListListModule,
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerServiceLog,
    ContractManagerServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerServiceLog, ContractManagerServiceEth],
})
export class ContractManagerModule implements OnModuleInit {
  constructor(protected readonly contractManagerServiceLog: ContractManagerServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerServiceLog.initRegistry();
  }
}
