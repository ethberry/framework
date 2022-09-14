import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ContractType,
  ModuleType,
  PyramidEventType,
  ReferralProgramEventType,
} from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { PyramidLogService } from "./log.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Pyramid user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const pyramidContracts = await contractService.findAllByType(ModuleType.PYRAMID);
        return {
          contract: {
            contractType: ContractType.PYRAMID,
            contractAddress: pyramidContracts.address || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              PyramidEventType.RuleCreated,
              PyramidEventType.RuleUpdated,
              PyramidEventType.StakingStart,
              PyramidEventType.StakingWithdraw,
              PyramidEventType.StakingFinish,
              PyramidEventType.FinalizedToken,
              PyramidEventType.WithdrawToken,
              ReferralProgramEventType.ReferralBonus,
              ReferralProgramEventType.ReferralProgram,
              ReferralProgramEventType.ReferralReward,
              ReferralProgramEventType.ReferralWithdraw,
              ContractEventType.Paused,
              ContractEventType.Unpaused
            ],
          },
          block: {
            fromBlock: pyramidContracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [PyramidLogService, Logger],
  exports: [PyramidLogService],
})
export class PyramidLogModule implements OnModuleDestroy {
  constructor(private readonly pyramidLogService: PyramidLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.pyramidLogService.updateBlock();
  }
}
