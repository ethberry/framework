import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractEventType, ContractType } from "@framework/types";

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
        const airdropAddr = configService.get<string>("AIRDROP_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(airdropAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");

        return {
          contract: {
            contractType: ContractType.AIRDROP,
            contractAddress: [airdropAddr],
            contractInterface: AirdropSol.abi,
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
              ContractEventType.Paused,
              ContractEventType.RedeemAirdrop,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Transfer,
              ContractEventType.UnpackDropbox,
              ContractEventType.Unpaused,
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
  constructor(private readonly airdropLogService: AirdropLogService) {}

  // save last block on SIGTERM
  public onModuleDestroy(): Promise<number> {
    return this.airdropLogService.updateBlock();
  }
}
