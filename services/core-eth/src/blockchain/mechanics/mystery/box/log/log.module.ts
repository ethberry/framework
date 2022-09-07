import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType } from "@framework/types";

import MysteryboxSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxFull.sol/ERC721MysteryboxFull.json";

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
        return {
          contract: {
            contractType: ContractType.MYSTERY,
            contractAddress: mysteryContracts.address || [],
            contractInterface: MysteryboxSol.abi,
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
            fromBlock: mysteryContracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
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
