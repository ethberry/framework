import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractEventType,
  ContractFeatures,
  ContractType,
  ExchangeEventType,
  LotteryEventType,
  ModuleType,
} from "@framework/types";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { LotteryLogService } from "./log.service";
import { getEventsTopics } from "../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");

        const lotteryContracts = await contractService.findAllByType([ModuleType.LOTTERY], [ContractFeatures.RANDOM]);

        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          LotteryEventType.Prize,
          LotteryEventType.RoundEnded,
          LotteryEventType.Released,
          LotteryEventType.RoundStarted,
          LotteryEventType.RoundFinalized,
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          AccessControlEventType.RoleAdminChanged,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          ExchangeEventType.PaymentEthReceived,
          ContractEventType.VrfSubscriptionSet,
        ];
        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: lotteryContracts ? lotteryContracts.address : [],
            contractInterface: new Interface(LotterySol.abi),
            topics,
          },
          block: {
            // fromBlock,
            fromBlock: lotteryContracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [LotteryLogService, Logger],
  exports: [LotteryLogService],
})
export class LotteryLogModule implements OnModuleDestroy {
  constructor(private readonly lotteryLogService: LotteryLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.lotteryLogService.updateBlock();
  }
}
