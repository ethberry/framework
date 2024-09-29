import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@ethberry/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@ethberry/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractEventType,
  ContractFeatures,
  ContractType,
  ExchangeEventType,
  ModuleType,
  RaffleEventType,
} from "@framework/types";
import { NodeEnv } from "@ethberry/constants";
import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { RaffleLogService } from "./log.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const raffleContracts = await contractService.findAllByType([ModuleType.RAFFLE], [ContractFeatures.RANDOM]);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          RaffleEventType.Prize,
          RaffleEventType.RoundEnded,
          RaffleEventType.Released,
          RaffleEventType.RoundStarted,
          RaffleEventType.RoundFinalizedRaffle,
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          AccessControlEventType.RoleAdminChanged,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          ExchangeEventType.PaymentReceived,
          ContractEventType.VrfSubscriptionSet,
        ];
        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.RAFFLE,
            contractAddress: raffleContracts.address,
            contractInterface: new Interface(RaffleSol.abi),
            topics,
          },
          block: {
            // fromBlock,
            fromBlock: raffleContracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [RaffleLogService, Logger],
  exports: [RaffleLogService],
})
export class RaffleLogModule implements OnModuleDestroy {
  constructor(private readonly raffleLogService: RaffleLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.raffleLogService.updateBlock();
  }
}
