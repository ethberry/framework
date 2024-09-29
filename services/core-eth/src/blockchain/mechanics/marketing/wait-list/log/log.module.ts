import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@ethberry/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@ethberry/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  ModuleType,
  WaitListEventType,
} from "@framework/types";
import { NodeEnv } from "@ethberry/constants";
import WaitListSol from "@framework/core-contracts/artifacts/contracts/Mechanics/WaitList/WaitList.sol/WaitList.json";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { WaitListLogService } from "./log.service";
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
        const waitListContracts = await contractService.findAllByType([ModuleType.WAIT_LIST]);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = waitListContracts.fromBlock || startingBlock;

        const eventNames = [
          WaitListEventType.WaitListRewardSet,
          WaitListEventType.WaitListRewardClaimed,
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          AccessControlEventType.RoleAdminChanged,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
        ];

        const topics = getEventsTopics(eventNames);
        return {
          contract: {
            contractType: ContractType.WAIT_LIST,
            contractAddress: waitListContracts.address,
            contractInterface: new Interface(WaitListSol.abi),
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
  providers: [WaitListLogService, Logger],
  exports: [WaitListLogService],
})
export class WaitListLogModule implements OnModuleDestroy {
  constructor(private readonly waitListLogService: WaitListLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.waitListLogService.updateBlock();
  }
}
