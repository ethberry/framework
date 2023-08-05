import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
// uncomment after updating contracts to ethers v6
// import { abiEncode, keccak256It } from "@gemunion/contracts-utils";
import { ContractFeatures, ModuleType } from "@framework/types";

import { ABI, ChainLinkEventSignatures, ChainLinkType } from "./interfaces";
import { ChainLinkLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { abiEncode, keccak256It } from "../utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const vrfCoordinator = await contractService.findSystemByName("ChainLink VRF");

        const randomTokens = await contractService.findAllTokensByType(void 0, [
          ContractFeatures.RANDOM,
          ContractFeatures.GENES,
        ]);
        const lotteryContracts = await contractService.findAllByType(
          [ModuleType.LOTTERY, ModuleType.RAFFLE],
          [ContractFeatures.RANDOM],
        );
        const allRandomAddresses = randomTokens.address?.concat(lotteryContracts ? lotteryContracts.address : []);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const topics = [
          keccak256It(ChainLinkEventSignatures.RandomWordsRequested as string),
          null,
          null,
          [...new Set(allRandomAddresses?.map(addr => abiEncode(addr, "address")))],
        ];

        return {
          contract: {
            contractType: ChainLinkType.VRF,
            contractAddress: vrfCoordinator.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: vrfCoordinator && vrfCoordinator.fromBlock ? vrfCoordinator.fromBlock : startingBlock,
            cron,
            debug: true,
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
