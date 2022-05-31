import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { Erc1155RecipeEventType, ContractType } from "@framework/types";

// system contract
import erc1155Craft from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";
import { Erc1155CraftLogService } from "./erc1155-craft.log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

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
        const erc1155craftAddr = configService.get<string>("ERC1155_CRAFT_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc1155craftAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC1155_CRAFT,
            contractAddress: [erc1155craftAddr],
            contractInterface: erc1155Craft.abi,
            // prettier-ignore
            eventNames: [
              Erc1155RecipeEventType.RecipeCrafted,
              Erc1155RecipeEventType.RecipeCreated,
              Erc1155RecipeEventType.RecipeUpdated,
            ],
          },
          block: {
            startBlock: fromBlock,
          },
        };
      },
    }),
  ],
  providers: [Erc1155CraftLogService, Logger],
  exports: [Erc1155CraftLogService],
})
export class Erc1155CraftLogModule {}
