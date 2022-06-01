import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc721RecipeEventType } from "@framework/types";

import { Erc721CraftLogService } from "./recipe-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import ERC1155ERC721CraftSol from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";

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
        const erc721craftAddr = configService.get<string>("ERC721_CRAFT_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc721craftAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC721_CRAFT,
            contractAddress: [erc721craftAddr],
            contractInterface: ERC1155ERC721CraftSol.abi,
            // prettier-ignore
            eventNames: [
              Erc721RecipeEventType.RecipeCrafted,
              Erc721RecipeEventType.RecipeCreated,
              Erc721RecipeEventType.RecipeUpdated,
            ],
          },
          block: {
            fromBlock,
          },
        };
      },
    }),
  ],
  providers: [Erc721CraftLogService, Logger],
  exports: [Erc721CraftLogService],
})
export class Erc721RecipeLogModule {}
