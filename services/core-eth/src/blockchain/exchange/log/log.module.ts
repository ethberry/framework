import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@ethberry/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@ethberry/nest-js-module-ethers-gcp";

import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  Erc1363EventType,
  ExchangeEventType,
  ModuleType,
  ReferralProgramEventType,
} from "@framework/types";
import { NodeEnv } from "@ethberry/constants";

import { ExchangeLogService } from "./log.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ABIExchange } from "./interfaces";
import { testChainId } from "@framework/constants";
import { getEventsTopics } from "../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const chainId = ~~configService.get<number>("CHAIN_ID", Number(testChainId));
        const exchangeEntity = await contractService.findSystemByName({
          contractModule: ModuleType.EXCHANGE,
          chainId,
        });
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = exchangeEntity.fromBlock || startingBlock;

        const eventNames = [
          // MODULE:PAUSE
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          // MODULE:CORE
          ExchangeEventType.Purchase,
          ExchangeEventType.PaymentReceived,
          ExchangeEventType.PaymentReleased,
          // MODULE:RENTABLE
          ExchangeEventType.Lend,
          // MODULE:CLAIM
          ExchangeEventType.Claim,
          // MODULE:CRAFT
          ExchangeEventType.Craft,
          // MODULE:MERGE
          ExchangeEventType.Merge,
          ExchangeEventType.Dismantle,
          // MODULE:MYSTERYBOX
          ExchangeEventType.PurchaseMysteryBox,
          // MODULE:LOOTBOX
          ExchangeEventType.PurchaseLootBox,
          // MODULE:REFERRAL
          ReferralProgramEventType.ReferralEvent,
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
        ];
        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.EXCHANGE,
            contractAddress: exchangeEntity.address,
            contractInterface: ABIExchange,
            topics,
          },
          block: {
            fromBlock,
            debug: nodeEnv === NodeEnv.development,
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
  public async onModuleDestroy(): Promise<void> {
    return this.exchangeLogService.updateBlock();
  }
}
