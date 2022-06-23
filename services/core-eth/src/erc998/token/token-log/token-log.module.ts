import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, Erc998TokenEventType } from "@framework/types";

import { Erc998TokenLogService } from "./token-log.service";

// custom contracts
import { ERC998Abi } from "./interfaces";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Erc998 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const erc998Contracts = await contractManagerService.findAllByType(ContractType.ERC998_TOKEN);
        return {
          contract: {
            contractType: ContractType.ERC998_TOKEN,
            contractAddress: erc998Contracts.address || [],
            contractInterface: ERC998Abi,
            // prettier-ignore
            eventNames: [
              Erc998TokenEventType.Approval,
              Erc998TokenEventType.ApprovalForAll,
              Erc998TokenEventType.DefaultRoyaltyInfo,
              Erc998TokenEventType.MintRandom,
              Erc998TokenEventType.Paused,
              Erc998TokenEventType.RandomRequest,
              Erc998TokenEventType.RedeemAirdrop,
              Erc998TokenEventType.TokenRoyaltyInfo,
              Erc998TokenEventType.Transfer,
              Erc998TokenEventType.UnpackAirdrop,
              Erc998TokenEventType.UnpackDropbox,
              Erc998TokenEventType.Unpaused,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged
            ],
          },
          block: {
            fromBlock: erc998Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [Erc998TokenLogService, Logger],
  exports: [Erc998TokenLogService],
})
export class Erc998TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc998TokenLogService: Erc998TokenLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return await this.erc998TokenLogService.updateBlock();
  }
}
