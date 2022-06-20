import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractType, Erc1155TokenEventType } from "@framework/types";

// custom contracts
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { Erc1155LogService } from "./token-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const erc1155Contracts = await contractManagerService.findAllByType(ContractType.ERC1155_TOKEN);
        return {
          contract: {
            contractType: ContractType.ERC1155_TOKEN,
            contractAddress: erc1155Contracts.address || [],
            contractInterface: ERC1155SimpleSol.abi,
            // prettier-ignore
            eventNames: [
              Erc1155TokenEventType.TransferSingle,
              Erc1155TokenEventType.TransferBatch,
              Erc1155TokenEventType.URI,
              Erc1155TokenEventType.ApprovalForAll,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
            ],
          },
          block: {
            fromBlock: erc1155Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [Erc1155LogService, Logger],
  exports: [Erc1155LogService],
})
export class Erc1155TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc1155LogService: Erc1155LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return await this.erc1155LogService.updateBlock();
  }
}
