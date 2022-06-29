import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, StakingEventType } from "@framework/types";

// system contract
import UniStakingSol from "@framework/core-contracts/artifacts/contracts/Staking/UniStaking.sol/UniStaking.json";
import { StakingLogService } from "./staking.log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Staking
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const stakingAddr = configService.get<string>("STAKING_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(stakingAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.STAKING,
            contractAddress: [stakingAddr],
            contractInterface: UniStakingSol.abi,
            // prettier-ignore
            eventNames: [
              StakingEventType.RuleCreated,
              StakingEventType.RuleUpdated,
              StakingEventType.StakingStart,
              StakingEventType.StakingWithdraw,
              StakingEventType.StakingFinish,
            ],
          },
          block: {
            fromBlock,
            debug: true,
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
  public async onModuleDestroy(): Promise<number> {
    return await this.stakingLogService.updateBlock();
  }
}
