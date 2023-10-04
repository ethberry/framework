import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType, NodeEnv } from "@framework/types";
import WrapperSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Wrapper/ERC721Wrapper.sol/ERC721Wrapper.json";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { WrapperLogService } from "./log.service";
import { getEventsTopics } from "../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const wrapperContracts = await contractService.findAllByType([ModuleType.WRAPPER]);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        const fromBlock = wrapperContracts.fromBlock || startingBlock;

        const eventNames = [
          ContractEventType.Approval,
          ContractEventType.ApprovalForAll,
          ContractEventType.DefaultRoyaltyInfo,
          ContractEventType.TokenRoyaltyInfo,
          ContractEventType.Transfer,
          ContractEventType.UnpackWrapper,
          AccessControlEventType.RoleGranted,
          AccessControlEventType.RoleRevoked,
          AccessControlEventType.RoleAdminChanged,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.WRAPPER,
            contractAddress: wrapperContracts.address,
            contractInterface: new Interface(WrapperSol.abi),
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
  providers: [WrapperLogService, Logger],
  exports: [WrapperLogService],
})
export class WrapperLogModule implements OnModuleDestroy {
  constructor(private readonly wrapperLogService: WrapperLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.wrapperLogService.updateBlock();
  }
}
