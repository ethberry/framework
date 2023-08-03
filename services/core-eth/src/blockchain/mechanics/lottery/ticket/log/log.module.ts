import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType } from "@framework/types";
import LotteryTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { LotteryTicketLogService } from "./log.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const lotteryTicketAddr = await contractService.findAllByType([ModuleType.LOTTERY], []);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: lotteryTicketAddr ? lotteryTicketAddr.address : [],
            contractInterface: new Interface(LotteryTicketSol.abi),
            // prettier-ignore
            eventNames: [
              ContractEventType.Transfer,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
            ],
          },
          block: {
            fromBlock: lotteryTicketAddr.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [LotteryTicketLogService, Logger],
  exports: [LotteryTicketLogService],
})
export class LotteryTicketLogModule implements OnModuleDestroy {
  constructor(private readonly lotteryTicketLogService: LotteryTicketLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.lotteryTicketLogService.updateBlock();
  }
}
