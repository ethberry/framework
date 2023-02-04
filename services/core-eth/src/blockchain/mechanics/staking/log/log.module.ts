import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractEventType, ContractType, ModuleType, StakingEventType } from "@framework/types";

// system contract
import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";
import { StakingLogService } from "./log.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Mechanics
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const stakingAddr = configService.get<string>("STAKING_ADDR", "");
        const stakingContracts = await contractService.findAllByType(ModuleType.STAKING);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const fromBlock = (await contractService.getLastBlock(stakingAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.STAKING,
            contractAddress: stakingContracts.address || [],
            contractInterface: StakingSol.abi,
            // prettier-ignore
            eventNames: [
              StakingEventType.RuleCreated,
              StakingEventType.RuleUpdated,
              StakingEventType.StakingStart,
              StakingEventType.StakingWithdraw,
              StakingEventType.StakingFinish,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
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
