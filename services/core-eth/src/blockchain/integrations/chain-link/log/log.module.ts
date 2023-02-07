import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ABI, ChainLinkEventSignatures, ChainLinkEventType, ChainLinkType } from "./interfaces";
import { ChainLinkLogService } from "./log.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { keccak256It, abiEncode } from "../utils";
import { ContractFeatures } from "@framework/types";

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

        const topics = [
          keccak256It(ChainLinkEventSignatures.RandomnessRequestId as string),
          [...new Set(randomTokens.address?.map(addr => abiEncode(addr, "address")))],
        ];
        return {
          contract: {
            contractType: ChainLinkType.VRF,
            contractAddress: [vrfContractAddr] || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ChainLinkEventType.RandomnessRequestId,
            ],
            topics,
          },
          block: {
            fromBlock: vrfCoordinator ? vrfCoordinator.fromBlock : startingBlock,
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
  public async onModuleDestroy(): Promise<number> {
    return await this.chainLinkLogService.updateBlock();
  }
}
