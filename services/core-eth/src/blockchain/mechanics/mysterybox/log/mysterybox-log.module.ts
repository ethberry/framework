import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType } from "@framework/types";

import { MysteryboxLogService } from "./mysterybox-log.service";
import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
// system contract
import MysteryboxSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721Mysterybox.sol/ERC721Mysterybox.json";

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
        const mysteryboxAddr = configService.get<string>("MYSTERYBOX_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(mysteryboxAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.MYSTERYBOX,
            contractAddress: [mysteryboxAddr],
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
            fromBlock,
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
