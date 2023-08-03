import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  ModuleType,
  StakingEventType,
} from "@framework/types";
import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { StakingLogService } from "./log.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Mechanics
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const stakingContracts = await contractService.findAllByType([ModuleType.STAKING]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        // const fromBlock = (await contractService.getLastBlock(stakingAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.STAKING,
            contractAddress: stakingContracts.address,
            contractInterface: new Interface(StakingSol.abi),
            // prettier-ignore
            eventNames: [
              StakingEventType.RuleCreated,
              StakingEventType.RuleUpdated,
              StakingEventType.DepositStart,
              StakingEventType.DepositWithdraw,
              StakingEventType.DepositFinish,
              StakingEventType.BalanceWithdraw,
              StakingEventType.DepositReturn,
              // MODULE:PAUSE
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
            ],
          },
          block: {
            // fromBlock,
            fromBlock: stakingContracts.fromBlock || startingBlock,
            debug: false,
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
