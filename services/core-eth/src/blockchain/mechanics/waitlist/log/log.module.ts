import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, ExchangeEventType } from "@framework/types";

import { WaitlistLogService } from "./log.service";

// system contract
import WaitlistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Waitlist/Waitlist.sol/Waitlist.json";
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
            contractInterface: new Interface(WaitlistSol.abi),
            // prettier-ignore
            eventNames: [
              ExchangeEventType.RewardSet,
              ExchangeEventType.ClaimReward,
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
  providers: [WaitlistLogService, Logger],
  exports: [WaitlistLogService],
})
export class WaitlistLogModule implements OnModuleDestroy {
  constructor(private readonly waitlistLogService: WaitlistLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.waitlistLogService.updateBlock();
  }
}
