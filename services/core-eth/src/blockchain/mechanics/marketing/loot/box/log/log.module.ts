import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  AccessListEventType,
  ContractEventType,
  ContractType,
  ModuleType,
} from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

import ERC721LootBoxBlacklistPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/ERC721LootBoxBlacklistPausable.sol/ERC721LootBoxBlacklistPausable.json";

import { LootLogService } from "./log.service";
import { ContractModule } from "../../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // ContractManager
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const lootContracts = await contractService.findAllByType([ModuleType.LOOT]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.ApprovalForAll,
          ContractEventType.DefaultRoyaltyInfo,
          ContractEventType.TokenRoyaltyInfo,
          ContractEventType.Transfer,
          ContractEventType.UnpackLootBox,
          ContractEventType.BaseURIUpdate,
          AccessControlEventType.RoleAdminChanged,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          ContractEventType.Paused,
          ContractEventType.Unpaused,
          // MODULE:ACCESS_LIST
          AccessListEventType.Blacklisted,
          AccessListEventType.UnBlacklisted,
        ];

        const topics = getEventsTopics(eventNames);
        return {
          contract: {
            contractType: ContractType.LOOT,
            contractAddress: lootContracts ? lootContracts.address : [],
            contractInterface: new Interface(ERC721LootBoxBlacklistPausableSol.abi),
            topics,
          },
          block: {
            fromBlock: lootContracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [LootLogService, Logger],
  exports: [LootLogService],
})
export class LootLogModule implements OnModuleDestroy {
  constructor(private readonly lootLogService: LootLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.lootLogService.updateBlock();
  }
}
