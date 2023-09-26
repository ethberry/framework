import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { ModuleType, NodeEnv } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ABI, ChainLinkEventSignatures, ChainLinkType } from "../../interfaces";
import { ChainLinkSubLogService } from "./log.service";
import { keccak256It } from "../../contract/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const chainId = ~~configService.get<number>("CHAIN_ID", Number(testChainId));
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const vrfCoordinator = await contractService.findSystemByName({
          contractModule: ModuleType.CHAIN_LINK,
          chainId,
        });
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        // search for all SubscriptionCreated events
        const topics = [[keccak256It(ChainLinkEventSignatures.SubscriptionCreated as string)], null];

        return {
          contract: {
            contractType: ChainLinkType.VRF_SUB,
            contractAddress: vrfCoordinator.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: vrfCoordinator && vrfCoordinator.fromBlock ? vrfCoordinator.fromBlock : startingBlock,
            cron,
            debug: nodeEnv === NodeEnv.development,
          },
        };
      },
    }),
  ],
  providers: [Logger, ChainLinkSubLogService],
  exports: [ChainLinkSubLogService],
})
export class ChainLinkSubscriptionLogModule implements OnModuleDestroy {
  constructor(private readonly chainLinkSubLogService: ChainLinkSubLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.chainLinkSubLogService.updateBlock();
  }
}
