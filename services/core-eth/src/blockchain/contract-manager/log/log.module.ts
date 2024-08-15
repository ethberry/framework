import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { AccessControlEventType, ContractManagerEventType, ContractType, ModuleType } from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractManagerLogService } from "./log.service";
import { ABI } from "./interfaces";
import { testChainId } from "@framework/constants";
import { getEventsTopics } from "../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const chainId = ~~configService.get<number>("CHAIN_ID", Number(testChainId));
        const contractManagerEntity = await contractService.findSystemByName({
          contractModule: ModuleType.CONTRACT_MANAGER,
          chainId,
        });
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = contractManagerEntity.fromBlock || startingBlock;

        const eventNames = [
          ContractManagerEventType.ERC20TokenDeployed,
          ContractManagerEventType.ERC721TokenDeployed,
          ContractManagerEventType.ERC998TokenDeployed,
          ContractManagerEventType.ERC1155TokenDeployed,
          ContractManagerEventType.VestingDeployed,
          ContractManagerEventType.MysteryBoxDeployed,
          ContractManagerEventType.LootBoxDeployed,
          ContractManagerEventType.CollectionDeployed,
          ContractManagerEventType.StakingDeployed,
          ContractManagerEventType.PonziDeployed,
          ContractManagerEventType.PaymentSplitterDeployed,
          ContractManagerEventType.LotteryDeployed,
          ContractManagerEventType.RaffleDeployed,
          ContractManagerEventType.WaitListDeployed,
          // MODULE:ACCESS_CONTROL
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.CONTRACT_MANAGER,
            contractAddress: contractManagerEntity.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [ContractManagerLogService, Logger],
  exports: [ContractManagerLogService],
})
export class ContractManagerLogModule implements OnModuleDestroy {
  constructor(private readonly contractManagerLogService: ContractManagerLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.contractManagerLogService.updateBlock();
  }
}
