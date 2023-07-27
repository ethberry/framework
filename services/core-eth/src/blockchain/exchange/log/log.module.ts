import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nestjs-ethers";
import { EthersContractModule } from "@gemunion/nestjs-ethers";

import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  Erc1363EventType,
  ExchangeEventType,
  ReferralProgramEventType,
} from "@framework/types";

import { ExchangeLogService } from "./log.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ABI } from "./interfaces";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const exchangeAddr = configService.get<string>("EXCHANGE_ADDR", "");
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = (await contractService.getLastBlock(exchangeAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.EXCHANGE,
            contractAddress: [exchangeAddr],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              // MODULE:PAUSE
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              // MODULE:CORE
              ExchangeEventType.Purchase,
              ExchangeEventType.PaymentEthReceived,
              ExchangeEventType.PaymentEthSent,
              // MODULE:RENTABLE
              ExchangeEventType.Lend,
              // MODULE:CLAIM
              ExchangeEventType.Claim,
              // MODULE:CRAFT
              ExchangeEventType.Craft,
              // MODULE:MYSTERYBOX
              ExchangeEventType.PurchaseMysteryBox,
              // MODULE:REFERRAL
              ReferralProgramEventType.ReferralProgram,
              ReferralProgramEventType.ReferralWithdraw,
              ReferralProgramEventType.ReferralReward,
              // MODULE:GRADE
              ExchangeEventType.Upgrade,
              // MODULE:BREEDING
              ExchangeEventType.Breed,
              // MODULE:LOTTERY
              ExchangeEventType.PurchaseLottery,
              // MODULE:RAFFLE
              ExchangeEventType.PurchaseRaffle,
              // MODULE:PAYMENT_SPLITTER
              ExchangeEventType.PayeeAdded,
              ExchangeEventType.PaymentReceived,
              ExchangeEventType.PaymentReleased,
              ExchangeEventType.ERC20PaymentReleased,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
              // MODULE:ERC1363
              Erc1363EventType.TransferReceived,
            ],
          },
          block: {
            fromBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [ExchangeLogService, Logger],
  exports: [ExchangeLogService],
})
export class ExchangeLogModule implements OnModuleDestroy {
  constructor(private readonly exchangeLogService: ExchangeLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.exchangeLogService.updateBlock();
  }
}
