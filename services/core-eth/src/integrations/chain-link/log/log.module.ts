import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractEventType, ContractType, TokenType } from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/test/LotteryRandomHardhat.sol/LotteryRandomHardhat.json";

import { ChainLinkLogService } from "./log.service";
import { ContractModule } from "../../../blockchain/hierarchy/contract/contract.module";
import { ContractService } from "../../../blockchain/hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const erc721Contracts = await contractService.findAllTokensByType(TokenType.ERC721);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        return {
          contract: {
            contractType: ContractType.ERC721_TOKEN,
            contractAddress: erc721Contracts.address || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractEventType.RandomRequest,
            ],
          },
          block: {
            fromBlock: erc721Contracts.fromBlock || startingBlock,
            debug: true,
          },
        };
      },
    }),
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const erc998Contracts = await contractService.findAllTokensByType(TokenType.ERC998);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        return {
          contract: {
            contractType: ContractType.ERC998_TOKEN,
            contractAddress: erc998Contracts.address || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractEventType.RandomRequest,

            ],
          },
          block: {
            fromBlock: erc998Contracts.fromBlock || startingBlock,
            debug: true,
          },
        };
      },
    }),
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const lotteryAddr = configService.get<string>("LOTTERY_ADDR", "");
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const fromBlock = (await contractService.getLastBlock(lotteryAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: [lotteryAddr],
            contractInterface: LotterySol.abi,
            // prettier-ignore
            eventNames: [
              ContractEventType.RandomRequest,
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
