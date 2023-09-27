import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";

import {
  AccessControlEventType,
  ContractEventType,
  ContractFeatures,
  ContractType,
  Erc4907EventType,
  TokenType,
} from "@framework/types";

// custom contracts
import { ABIRandom } from "./interfaces";
import { Erc721TokenRandomLogService } from "./log.service";
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
        const erc721RandomContracts = await contractService.findAllRandomTokensByType(TokenType.ERC721, [
          ContractFeatures.RANDOM,
          ContractFeatures.GENES,
        ]);
        //
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.ApprovalForAll,
          ContractEventType.DefaultRoyaltyInfo,
          ContractEventType.MintRandom,
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
          ContractEventType.VrfSubscriptionSet,
        ];
        const topics = getEventsTopics(eventNames);
        console.info("RANDOM_TOPICS", topics);
        return {
          contract: {
            contractType: ContractType.ERC721_TOKEN_RANDOM,
            contractAddress: erc721RandomContracts.address,
            contractInterface: ABIRandom,
            // topics
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
              ContractEventType.MintRandom,
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
              ContractEventType.VrfSubscriptionSet
            ],
          },
          block: {
            fromBlock: erc721RandomContracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [Erc721TokenRandomLogService, Logger],
  exports: [Erc721TokenRandomLogService],
})
export class Erc721TokenRandomLogModule implements OnModuleDestroy {
  constructor(private readonly erc721TokenRandomLogService: Erc721TokenRandomLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.erc721TokenRandomLogService.updateBlock();
  }
}
