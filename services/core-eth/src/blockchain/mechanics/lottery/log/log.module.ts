import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, LotteryEventType } from "@framework/types";

import { LotteryLogService } from "./log.service";
import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
// system contract
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const lotteryContracts = await contractManagerService.findAllByType(ContractType.LOTTERY);
        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: lotteryContracts.address || [],
            contractInterface: LotterySol.abi,
            // prettier-ignore
            eventNames: [
              LotteryEventType.Prize,
              LotteryEventType.RoundEnded,
              LotteryEventType.Purchase,
              LotteryEventType.Released,
              LotteryEventType.RoundStarted,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              AccessControlEventType.RoleAdminChanged,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked
            ],
          },
          block: {
            fromBlock: lotteryContracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
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
