import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
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
        const pyramidContracts = await contractService.findAllByType([ModuleType.PYRAMID]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        return {
          contract: {
            contractType: ContractType.PYRAMID,
            contractAddress: pyramidContracts.address,
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
              PyramidEventType.ERC20PaymentReleased,
              PyramidEventType.PaymentEthReceived,
              PyramidEventType.PaymentEthSent,
              PyramidEventType.PayeeAdded,
              PyramidEventType.PaymentReleased,
              PyramidEventType.PaymentReceived,
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
            fromBlock: pyramidContracts.fromBlock || startingBlock,
            debug: false,
            cron,
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
  public async onModuleDestroy(): Promise<void> {
    return this.pyramidLogService.updateBlock();
  }
}
