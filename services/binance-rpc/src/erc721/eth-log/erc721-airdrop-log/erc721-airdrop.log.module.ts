import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { Erc721TokenEventType, ContractType } from "@framework/types";

import { Erc721AirdropLogService } from "./erc721-airdrop.log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import erc721Airdrop from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";

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
        const erc721airdropAddr = configService.get<string>("ERC721_AIRDROP_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc721airdropAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC721_AIRDROP,
            contractAddress: [erc721airdropAddr],
            contractInterface: erc721Airdrop.abi,
            // prettier-ignore
            eventNames: [
              Erc721TokenEventType.Approval,
              Erc721TokenEventType.ApprovalForAll,
              Erc721TokenEventType.DefaultRoyaltyInfo,
              Erc721TokenEventType.Paused,
              Erc721TokenEventType.RedeemAirdrop,
              Erc721TokenEventType.RoleAdminChanged,
              Erc721TokenEventType.RoleGranted,
              Erc721TokenEventType.RoleRevoked,
              Erc721TokenEventType.TokenRoyaltyInfo,
              Erc721TokenEventType.Transfer,
              Erc721TokenEventType.UnpackDropbox,
              Erc721TokenEventType.Unpaused,
            ],
          },
          block: {
            startBlock: fromBlock,
          },
        };
      },
    }),
  ],
  providers: [Erc721AirdropLogService, Logger],
  exports: [Erc721AirdropLogService],
})
export class Erc721AirdropLogModule {}
