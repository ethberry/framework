import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, Erc998TokenEventType } from "@framework/types";

import { Erc998AirdropLogService } from "./airdrop-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import ERC998AirdropSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";

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
        const erc998airdropAddr = configService.get<string>("ERC998_AIRDROP_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc998airdropAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");

        return {
          contract: {
            contractType: ContractType.ERC998_AIRDROP,
            contractAddress: [erc998airdropAddr],
            contractInterface: ERC998AirdropSol.abi,
            // prettier-ignore
            eventNames: [
              Erc998TokenEventType.Approval,
              Erc998TokenEventType.ApprovalForAll,
              Erc998TokenEventType.DefaultRoyaltyInfo,
              Erc998TokenEventType.Paused,
              Erc998TokenEventType.RedeemAirdrop,
              Erc998TokenEventType.TokenRoyaltyInfo,
              Erc998TokenEventType.Transfer,
              Erc998TokenEventType.UnpackDropbox,
              Erc998TokenEventType.Unpaused,
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
  providers: [Erc998AirdropLogService, Logger],
  exports: [Erc998AirdropLogService],
})
export class Erc998AirdropLogModule implements OnModuleDestroy {
  constructor(private readonly erc998AirdropLogService: Erc998AirdropLogService) {}

  // save last block on SIGTERM
  public onModuleDestroy(): Promise<number> {
    return this.erc998AirdropLogService.updateBlock();
  }
}
