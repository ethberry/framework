import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, Erc721TokenEventType } from "@framework/types";

import { AirdropLogService } from "./airdrop-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

import AirdropSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Airdrop/Airdrop.sol/Airdrop.json";

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
        const erc721airdropAddr = configService.get<string>("AIRDROP_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc721airdropAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");

        return {
          contract: {
            contractType: ContractType.ERC721_AIRDROP,
            contractAddress: [erc721airdropAddr],
            contractInterface: AirdropSol.abi,
            // prettier-ignore
            eventNames: [
              Erc721TokenEventType.Approval,
              Erc721TokenEventType.ApprovalForAll,
              Erc721TokenEventType.DefaultRoyaltyInfo,
              Erc721TokenEventType.Paused,
              Erc721TokenEventType.RedeemAirdrop,
              Erc721TokenEventType.TokenRoyaltyInfo,
              Erc721TokenEventType.Transfer,
              Erc721TokenEventType.UnpackDropbox,
              Erc721TokenEventType.Unpaused,
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
  providers: [AirdropLogService, Logger],
  exports: [AirdropLogService],
})
export class AirdropLogModule implements OnModuleDestroy {
  constructor(private readonly erc721AirdropLogService: AirdropLogService) {}

  // save last block on SIGTERM
  public onModuleDestroy(): Promise<number> {
    return this.erc721AirdropLogService.updateBlock();
  }
}
