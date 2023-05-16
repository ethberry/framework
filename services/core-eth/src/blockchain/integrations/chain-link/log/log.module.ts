import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { ContractFeatures } from "@framework/types";

import { ABI, ChainLinkEventSignatures, ChainLinkEventType, ChainLinkType } from "./interfaces";
import { ChainLinkLogService } from "./log.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { abiEncode, keccak256It } from "../utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const vrfContractAddr = configService.get<string>("VRF_ADDR", "");
        const vrfCoordinator = await contractService.findOne({ address: vrfContractAddr.toLowerCase() });

        const randomTokens = await contractService.findAllTokensByType(void 0, [ContractFeatures.RANDOM]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const topics = [
          keccak256It(ChainLinkEventSignatures.RandomWordsRequested as string),
          null,
          null,
          [...new Set(randomTokens.address?.map(addr => abiEncode(addr, "address")))],
        ];
        return {
          contract: {
            contractType: ChainLinkType.VRF,
            contractAddress: [vrfContractAddr] || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ChainLinkEventType.RandomWordsRequested,
            ],
            topics,
          },
          block: {
            fromBlock: vrfCoordinator ? vrfCoordinator.fromBlock : startingBlock,
            debug: false,
            cron,
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
  public async onModuleDestroy(): Promise<number> {
    return this.chainLinkLogService.updateBlock();
  }
}
