import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType } from "@framework/types";

import MysteryboxSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxFull.sol/ERC721MysteryboxFull.json";

import { MysteryboxLogService } from "./log.service";
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
        const mysteryboxContracts = await contractService.findAllByType(ModuleType.MYSTERYBOX);
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
              AccessControlEventType.RoleRevoked,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
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
