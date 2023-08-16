import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { AccessControlEventType, ContractManagerEventType, ContractType, ModuleType } from "@framework/types";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractManagerLogService } from "./log.service";
import { ABI } from "./interfaces";
import { testChainId } from "@framework/constants";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
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

        return {
          contract: {
            contractType: ContractType.CONTRACT_MANAGER,
            contractAddress: contractManagerEntity.address,
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractManagerEventType.VestingDeployed,
              ContractManagerEventType.ERC20TokenDeployed,
              ContractManagerEventType.ERC721TokenDeployed,
              ContractManagerEventType.ERC998TokenDeployed,
              ContractManagerEventType.ERC1155TokenDeployed,
              ContractManagerEventType.MysteryboxDeployed,
              ContractManagerEventType.CollectionDeployed,
              ContractManagerEventType.StakingDeployed,
              ContractManagerEventType.PyramidDeployed,
              ContractManagerEventType.LotteryDeployed,
              ContractManagerEventType.RaffleDeployed,
              ContractManagerEventType.WaitListDeployed,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
            ],
          },
          block: {
            fromBlock,
            debug: false,
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
