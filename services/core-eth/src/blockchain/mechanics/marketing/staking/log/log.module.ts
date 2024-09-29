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
  ReferralProgramEventType,
  StakingEventType,
} from "@framework/types";
import { NodeEnv } from "@ethberry/constants";
import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { StakingLogService } from "./log.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Mechanics
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const stakingContracts = await contractService.findAllByType([ModuleType.STAKING]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const eventNames = [
          StakingEventType.RuleCreated,
          StakingEventType.RuleUpdated,
          StakingEventType.BalanceWithdraw,
          StakingEventType.DepositStart,
          StakingEventType.DepositWithdraw,
          StakingEventType.DepositFinish,
          StakingEventType.DepositReturn,
          StakingEventType.DepositPenalty,
          // MODULE:REFERRAL
          ReferralProgramEventType.ReferralEvent,
          ReferralProgramEventType.ReferralProgram,
          ReferralProgramEventType.ReferralWithdraw,
          ReferralProgramEventType.ReferralReward,
          // MODULE:PAUSE
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          // MODULE:ACCESS_CONTROL
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.STAKING,
            contractAddress: stakingContracts.address,
            contractInterface: new Interface(StakingSol.abi),
            topics,
          },
          block: {
            // fromBlock,
            fromBlock: stakingContracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [StakingLogService, Logger],
  exports: [StakingLogService],
})
export class StakingLogModule implements OnModuleDestroy {
  constructor(private readonly stakingLogService: StakingLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.stakingLogService.updateBlock();
  }
}
