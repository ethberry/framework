import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  AccessListEventType,
  ContractEventType,
  ContractFeatures,
  ContractType,
  TokenType,
} from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

// custom contracts
import { ABIRandom } from "./interfaces";
import { Erc998TokenRandomLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Erc998 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const erc998RandomContracts = await contractService.findAllRandomTokensByType(TokenType.ERC998, [
          ContractFeatures.RANDOM,
          ContractFeatures.GENES,
        ]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.ApprovalForAll,
          ContractEventType.BatchReceivedChild,
          ContractEventType.BatchTransferChild,
          ContractEventType.DefaultRoyaltyInfo,
          ContractEventType.MintRandom,
          ContractEventType.Paused,
          ContractEventType.ReceivedChild,
          ContractEventType.SetMaxChild,
          ContractEventType.TokenRoyaltyInfo,
          ContractEventType.Transfer,
          ContractEventType.TransferChild,
          ContractEventType.UnWhitelistedChild,
          ContractEventType.UnpackMysteryBox,
          ContractEventType.Unpaused,
          ContractEventType.WhitelistedChild,
          ContractEventType.LevelUp,
          ContractEventType.VrfSubscriptionSet,
          ContractEventType.BaseURIUpdate,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
          // MODULE:ACCESS_LIST
          AccessListEventType.Blacklisted,
          AccessListEventType.UnBlacklisted,
        ];
        const topics = getEventsTopics(eventNames);
        return {
          contract: {
            contractType: ContractType.ERC998_TOKEN_RANDOM,
            contractAddress: erc998RandomContracts.address,
            contractInterface: ABIRandom,
            topics,
          },
          block: {
            fromBlock: erc998RandomContracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [Erc998TokenRandomLogService, Logger],
  exports: [Erc998TokenRandomLogService],
})
export class Erc998TokenRandomLogModule implements OnModuleDestroy {
  constructor(private readonly erc998TokenRandomLogService: Erc998TokenRandomLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.erc998TokenRandomLogService.updateBlock();
  }
}
