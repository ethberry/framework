import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  AccessListEventType,
  ContractEventType,
  ContractType,
  NodeEnv,
  TokenType,
} from "@framework/types";

import { ABI } from "./interfaces";

import { Erc20LogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const erc20Contracts = await contractService.findAllTokensByType(TokenType.ERC20);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.Transfer,
          AccessListEventType.Blacklisted,
          AccessListEventType.UnBlacklisted,
          AccessListEventType.Whitelisted,
          AccessListEventType.UnWhitelisted,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.ERC20_TOKEN,
            contractAddress: erc20Contracts.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: erc20Contracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [Erc20LogService, Logger],
  exports: [Erc20LogService],
})
export class Erc20TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc20LogService: Erc20LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.erc20LogService.updateBlock();
  }
}
