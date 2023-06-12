import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractEventType,
  ContractFeatures,
  ContractType,
  LotteryEventType,
  ModuleType,
} from "@framework/types";

import { LotteryLogService } from "./log.service";

// system contract
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const lotteryContracts = await contractService.findAllByType(ModuleType.LOTTERY, []);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        // const fromBlock = (await contractService.getLastBlock(lotteryAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: lotteryContracts.address || [],
            contractInterface: LotterySol.abi,
            // prettier-ignore
            eventNames: [
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
            ],
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
  public async onModuleDestroy(): Promise<number> {
    return this.lotteryLogService.updateBlock();
  }
}
