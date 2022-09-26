import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, LotteryEventType } from "@framework/types";

import { LotteryLogService } from "./log.service";

// system contract
// import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/test/LotteryRandomHardhat.sol/LotteryRandomHardhat.json";
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
        const lotteryAddr = configService.get<string>("LOTTERY_ADDR", "");
        const fromBlock =
          (await contractService.getLastBlock(lotteryAddr)) || ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: [lotteryAddr],
            contractInterface: LotterySol.abi,
            // prettier-ignore
            eventNames: [
              LotteryEventType.Prize,
              LotteryEventType.RoundEnded,
              LotteryEventType.Purchase,
              LotteryEventType.Released,
              LotteryEventType.RoundStarted,
              LotteryEventType.RoundFinalized,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              AccessControlEventType.RoleAdminChanged,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              // DEV ONLY
              ContractEventType.RandomRequest
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
