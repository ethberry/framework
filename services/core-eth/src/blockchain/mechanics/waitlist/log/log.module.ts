import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@gemunion/nestjs-ethers";
import { EthersContractModule } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, WaitListEventType } from "@framework/types";
import WaitListSol from "@framework/core-contracts/artifacts/contracts/Mechanics/WaitList/WaitList.sol/WaitList.json";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { WaitListLogService } from "./log.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const waitlistAddr = configService.get<string>("WAITLIST_ADDR", "");
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = (await contractService.getLastBlock(waitlistAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.WAITLIST,
            contractAddress: [waitlistAddr],
            contractInterface: new Interface(WaitListSol.abi),
            // prettier-ignore
            eventNames: [
              WaitListEventType.WaitListRewardSet,
              WaitListEventType.WaitListRewardClaimed,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              AccessControlEventType.RoleAdminChanged,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked
            ],
          },
          block: {
            fromBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [WaitListLogService, Logger],
  exports: [WaitListLogService],
})
export class WaitListLogModule implements OnModuleDestroy {
  constructor(private readonly waitListLogService: WaitListLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.waitListLogService.updateBlock();
  }
}
