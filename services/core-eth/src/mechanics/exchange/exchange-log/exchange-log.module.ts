import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, ExchangeEventType } from "@framework/types";

// system contract
import ERC1155ERC1155CraftSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";
import { ExchangeLogService } from "./exchange-log.service";
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
        const erc1155craftAddr = configService.get<string>("EXCHANGE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc1155craftAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC1155_CRAFT,
            contractAddress: [erc1155craftAddr],
            contractInterface: ERC1155ERC1155CraftSol.abi,
            // prettier-ignore
            eventNames: [
              ExchangeEventType.RecipeCrafted,
              ExchangeEventType.RecipeCreated,
              ExchangeEventType.RecipeUpdated,
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
  providers: [ExchangeLogService, Logger],
  exports: [ExchangeLogService],
})
export class ExchangeLogModule implements OnModuleDestroy {
  constructor(private readonly erc1155RecipeLogService: ExchangeLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc1155RecipeLogService.updateBlock();
  }
}
