import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType } from "@framework/types";

import ERC721MysteryboxBlacklistPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxBlacklistPausable.sol/ERC721MysteryboxBlacklistPausable.json";

import { MysteryLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // ContractManager
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const mysteryContracts = await contractService.findAllByType(ModuleType.MYSTERY);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        return {
          contract: {
            contractType: ContractType.MYSTERY,
            contractAddress: mysteryContracts.address || [],
            contractInterface: new Interface(ERC721MysteryboxBlacklistPausableSol.abi),
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Transfer,
              ContractEventType.UnpackMysterybox,
              AccessControlEventType.RoleAdminChanged,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
            ],
          },
          block: {
            fromBlock: mysteryContracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [MysteryLogService, Logger],
  exports: [MysteryLogService],
})
export class MysteryLogModule implements OnModuleDestroy {
  constructor(private readonly mysteryLogService: MysteryLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.mysteryLogService.updateBlock();
  }
}
