import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  ModuleType,
  PonziEventType,
  ReferralProgramEventType,
} from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { PonziLogService } from "./log.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Ponzi user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const ponziContracts = await contractService.findAllByType([ModuleType.PONZI]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          PonziEventType.RuleCreated,
          PonziEventType.RuleUpdated,
          PonziEventType.StakingStart,
          PonziEventType.StakingWithdraw,
          PonziEventType.StakingFinish,
          PonziEventType.FinalizedToken,
          PonziEventType.WithdrawToken,
          ReferralProgramEventType.ReferralBonus,
          ReferralProgramEventType.ReferralProgram,
          ReferralProgramEventType.ReferralReward,
          ReferralProgramEventType.ReferralWithdraw,
          PonziEventType.ERC20PaymentReleased,
          PonziEventType.PaymentEthReceived,
          PonziEventType.PaymentEthSent,
          PonziEventType.PayeeAdded,
          PonziEventType.PaymentReleased,
          PonziEventType.PaymentReceived,
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
            contractType: ContractType.PONZI,
            contractAddress: ponziContracts.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: ponziContracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [PonziLogService, Logger],
  exports: [PonziLogService],
})
export class PonziLogModule implements OnModuleDestroy {
  constructor(private readonly ponziLogService: PonziLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.ponziLogService.updateBlock();
  }
}
