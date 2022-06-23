import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractType, Erc998TokenEventType } from "@framework/types";

import { Erc998DropboxLogService } from "./dropbox-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import ERC998DropboxSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";

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
        const erc998dropboxAddr = configService.get<string>("ERC998_DROPBOX_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc998dropboxAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC998_DROPBOX,
            contractAddress: [erc998dropboxAddr],
            contractInterface: ERC998DropboxSol.abi,
            // prettier-ignore
            eventNames: [
              Erc998TokenEventType.Approval,
              Erc998TokenEventType.ApprovalForAll,
              Erc998TokenEventType.DefaultRoyaltyInfo,
              Erc998TokenEventType.TokenRoyaltyInfo,
              Erc998TokenEventType.Transfer,
              Erc998TokenEventType.UnpackDropbox,
              AccessControlEventType.RoleAdminChanged,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
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
  providers: [Erc998DropboxLogService, Logger],
  exports: [Erc998DropboxLogService],
})
export class Erc998DropboxLogModule implements OnModuleDestroy {
  constructor(private readonly erc998DropboxLogService: Erc998DropboxLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc998DropboxLogService.updateBlock();
  }
}
