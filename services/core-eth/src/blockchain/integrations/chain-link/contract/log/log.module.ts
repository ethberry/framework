import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { toBeHex, zeroPadValue } from "ethers";
import { IsNull, Not } from "typeorm";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";

import { ModuleType, NodeEnv } from "@framework/types";

import { ABI, ChainLinkEventSignatures, ChainLinkType } from "../../interfaces";
import { ChainLinkLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { keccak256It } from "../utils";
import { testChainId } from "@framework/constants";
import { ChainLinkSubscriptionService } from "../../subscription/subscription.service";
import { ChainLinkSubscriptionModule } from "../../subscription/subscription.module";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    ChainLinkSubscriptionModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule, ChainLinkSubscriptionModule],
      inject: [ConfigService, ContractService, ChainLinkSubscriptionService],
      useFactory: async (
        configService: ConfigService,
        contractService: ContractService,
        chainLinkSubscriptionService: ChainLinkSubscriptionService,
      ): Promise<IModuleOptions> => {
        // const randomTokens = await contractService.findAllTokensByType(void 0, [
        //   ContractFeatures.RANDOM,
        //   ContractFeatures.GENES,
        // ]);
        // const lotteryContracts = await contractService.findAllByType(
        //   [ModuleType.LOTTERY, ModuleType.RAFFLE],
        //   [ContractFeatures.RANDOM],
        // );
        // const allRandomAddresses = randomTokens.address?.concat(lotteryContracts ? lotteryContracts.address : []);
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
        const subscriptions = await chainLinkSubscriptionService.findAll({ chainId, vrfSubId: Not(IsNull()) });
        const subIds = subscriptions.map(sub => zeroPadValue(toBeHex(sub.vrfSubId), 32));

        // search for all RandomWordsRequested from all registered Subscriptions for current chainId
        const topics = [
          [keccak256It(ChainLinkEventSignatures.RandomWordsRequested as string)],
          null,
          [...new Set(subIds)],
        ];

        return {
          contract: {
            contractType: ChainLinkType.VRF,
            contractAddress: subIds.length > 0 ? vrfCoordinator.address : [],
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
  providers: [Logger, ChainLinkLogService],
  exports: [ChainLinkLogService],
})
export class ChainLinkLogModule implements OnModuleDestroy {
  constructor(private readonly chainLinkLogService: ChainLinkLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.chainLinkLogService.updateBlock();
  }
}
