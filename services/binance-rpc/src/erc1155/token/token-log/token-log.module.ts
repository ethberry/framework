import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { ContractType, Erc1155TokenEventType } from "@framework/types";

// custom contracts
import ERC1155SimpleSol from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

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
        const erc1155Contracts = await contractManagerService.findAllByType(ContractType.ERC1155_COLLECTION);
        return {
          contract: {
            contractType: ContractType.ERC1155_COLLECTION,
            contractAddress: erc1155Contracts.address || [],
            contractInterface: ERC1155SimpleSol.abi,
            // prettier-ignore
            eventNames: [
              Erc1155TokenEventType.TransferSingle,
              Erc1155TokenEventType.TransferBatch,
              Erc1155TokenEventType.URI,
              Erc1155TokenEventType.ApprovalForAll,
              Erc1155TokenEventType.RoleGranted,
              Erc1155TokenEventType.RoleRevoked
            ],
          },
          block: {
            fromBlock: erc1155Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
          },
        };
      },
    }),
  ],
  providers: [Erc1155LogService, Logger],
  exports: [Erc1155LogService],
})
export class Erc1155TokenLogModule {}
