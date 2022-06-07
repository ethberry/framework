import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc1155MarketplaceEventType } from "@framework/types";

// system contract
import ERC1155MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";
import { Erc1155MarketplaceLogService } from "./marketplace.log.service";
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
        const erc1155marketAddr = configService.get<string>("ERC1155_MARKETPLACE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc1155marketAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC1155_MARKETPLACE,
            contractAddress: [erc1155marketAddr],
            contractInterface: ERC1155MarketplaceSol.abi,
            // prettier-ignore
            eventNames: [
              Erc1155MarketplaceEventType.Redeem,
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
  providers: [Erc1155MarketplaceLogService, Logger],
  exports: [Erc1155MarketplaceLogService],
})
export class Erc1155MarketplaceLogModule implements OnModuleDestroy {
  constructor(private readonly erc1155MarketplaceLogService: Erc1155MarketplaceLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return await this.erc1155MarketplaceLogService.updateBlock();
  }
}
