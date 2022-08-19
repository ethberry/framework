import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType } from "@framework/types";

import { MysteryboxLogService } from "./log.service";
import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";

import MysteryboxSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxFull.sol/ERC721MysteryboxFull.json";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // ContractManager
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const mysteryboxContracts = await contractManagerService.findAllByType(ContractType.MYSTERYBOX);
        return {
          contract: {
            contractType: ContractType.MYSTERYBOX,
            contractAddress: mysteryboxContracts.address || [],
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
              AccessControlEventType.RoleRevoked
            ],
          },
          block: {
            fromBlock: mysteryboxContracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [MysteryboxLogService, Logger],
  exports: [MysteryboxLogService],
})
export class MysteryboxLogModule implements OnModuleDestroy {
  constructor(private readonly mysteryboxLogService: MysteryboxLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.mysteryboxLogService.updateBlock();
  }
}
