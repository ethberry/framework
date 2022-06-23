import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc998RecipeEventType } from "@framework/types";

import { Erc998CraftLogService } from "./recipe-log.service";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// system contract
import ERC1155ERC998CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";

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
        const erc998craftAddr = configService.get<string>("ERC998_CRAFT_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc998craftAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC998_CRAFT,
            contractAddress: [erc998craftAddr],
            contractInterface: ERC1155ERC998CraftSol.abi,
            // prettier-ignore
            eventNames: [
              Erc998RecipeEventType.RecipeCrafted,
              Erc998RecipeEventType.RecipeCreated,
              Erc998RecipeEventType.RecipeUpdated,
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
  providers: [Erc998CraftLogService, Logger],
  exports: [Erc998CraftLogService],
})
export class Erc998RecipeLogModule implements OnModuleDestroy {
  constructor(private readonly erc998CraftLogService: Erc998CraftLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc998CraftLogService.updateBlock();
  }
}
