import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractEventType, ContractType, ModuleType, NodeEnv, TokenType } from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { DiscreteLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const erc721Contracts = await contractService.findAllCommonTokensByType(TokenType.ERC721);
        const erc998Contracts = await contractService.findAllCommonTokensByType(TokenType.ERC998);
        const erc721Collections = await contractService.findAllByType([ModuleType.COLLECTION]);
        const contractsAdresses = ([] as Array<string>).concat(
          erc721Contracts.address,
          erc998Contracts.address,
          erc721Collections.address,
        );
        const unique = [...new Set(contractsAdresses)];
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [ContractEventType.LevelUp];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.ERC721_TOKEN,
            contractAddress: unique,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: erc721Contracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [DiscreteLogService, Logger],
})
export class DiscreteTokenLogModule implements OnModuleDestroy {
  constructor(private readonly discreteLogService: DiscreteLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.discreteLogService.updateBlock();
  }
}
