import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { AccessControlEventType, ContractEventType, ContractType, TokenType } from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { Erc998LogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Erc998 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const erc998Contracts = await contractService.findAllCommonTokensByType(TokenType.ERC998);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        return {
          contract: {
            contractType: ContractType.ERC998_TOKEN,
            contractAddress: erc998Contracts.address,
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.BatchReceivedChild,
              ContractEventType.BatchTransferChild,
              ContractEventType.DefaultRoyaltyInfo,
              ContractEventType.MintRandom,
              ContractEventType.Paused,
              ContractEventType.ReceivedChild,
              ContractEventType.RedeemClaim,
              ContractEventType.SetMaxChild,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Transfer,
              ContractEventType.TransferChild,
              ContractEventType.UnWhitelistedChild,
              ContractEventType.UnpackClaim,
              ContractEventType.UnpackMysteryBox,
              ContractEventType.Unpaused,
              ContractEventType.WhitelistedChild,
              ContractEventType.LevelUp,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged
            ],
          },
          block: {
            fromBlock: erc998Contracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [Erc998LogService, Logger],
  exports: [Erc998LogService],
})
export class Erc998TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc998TokenLogService: Erc998LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.erc998TokenLogService.updateBlock();
  }
}
