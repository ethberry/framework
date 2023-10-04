import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";

import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  Erc4907EventType,
  NodeEnv,
  TokenType,
} from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { Erc721LogService } from "./log.service";
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
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.ApprovalForAll,
          ContractEventType.DefaultRoyaltyInfo,
          ContractEventType.Paused,
          ContractEventType.RedeemClaim,
          ContractEventType.TokenRoyaltyInfo,
          ContractEventType.Transfer,
          ContractEventType.UnpackClaim,
          ContractEventType.UnpackMysteryBox,
          ContractEventType.Unpaused,
          ContractEventType.ConsecutiveTransfer,
          ContractEventType.LevelUp,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
          Erc4907EventType.UpdateUser,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.ERC721_TOKEN,
            contractAddress: erc721Contracts.address,
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
  providers: [Erc721LogService, Logger],
  exports: [Erc721LogService],
})
export class Erc721TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc721TokenLogService: Erc721LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.erc721TokenLogService.updateBlock();
  }
}
