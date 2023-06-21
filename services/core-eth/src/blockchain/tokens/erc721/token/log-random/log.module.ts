import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule } from "@gemunion/nestjs-ethers";
import type { IModuleOptions } from "@gemunion/nestjs-ethers";

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
        return {
          contract: {
            contractType: ContractType.ERC721_TOKEN_RANDOM,
            contractAddress: erc721RandomContracts.address || [],
            contractInterface: ABIRandom,
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
              ContractEventType.UnpackMysterybox,
              ContractEventType.Unpaused,
              ContractEventType.ConsecutiveTransfer,
              ContractEventType.LevelUp,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
              Erc4907EventType.UpdateUser
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
  public async onModuleDestroy(): Promise<number> {
    return this.erc721TokenRandomLogService.updateBlock();
  }
}
