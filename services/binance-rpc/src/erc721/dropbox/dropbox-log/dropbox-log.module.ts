import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc721TokenEventType } from "@framework/types";

import { Erc721DropboxLogService } from "./dropbox-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import ERC721DropboxSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";

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
        const erc721dropboxAddr = configService.get<string>("ERC721_DROPBOX_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc721dropboxAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC721_DROPBOX,
            contractAddress: [erc721dropboxAddr],
            contractInterface: ERC721DropboxSol.abi,
            // prettier-ignore
            eventNames: [
              Erc721TokenEventType.Approval,
              Erc721TokenEventType.ApprovalForAll,
              Erc721TokenEventType.DefaultRoyaltyInfo,
              Erc721TokenEventType.RoleAdminChanged,
              Erc721TokenEventType.RoleGranted,
              Erc721TokenEventType.RoleRevoked,
              Erc721TokenEventType.TokenRoyaltyInfo,
              Erc721TokenEventType.Transfer,
              Erc721TokenEventType.UnpackDropbox,
            ],
          },
          block: {
            fromBlock,
          },
        };
      },
    }),
  ],
  providers: [Erc721DropboxLogService, Logger],
  exports: [Erc721DropboxLogService],
})
export class Erc721DropboxLogModule {}
