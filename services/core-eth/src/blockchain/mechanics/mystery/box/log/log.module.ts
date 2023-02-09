import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
        return {
          contract: {
            contractType: ContractType.MYSTERY,
            contractAddress: mysteryContracts.address || [],
            contractInterface: ERC721MysteryboxBlacklistPausableSol.abi,
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
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [MysteryLogService, Logger],
  exports: [MysteryLogService],
})
export class MysteryLogModule implements OnModuleDestroy {
  constructor(private readonly mysteryboxLogService: MysteryLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.mysteryboxLogService.updateBlock();
  }
}
