import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { Erc1155MarketplaceEventType, ContractType } from "@framework/types";

// system contract
import erc1155Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";
import { Erc1155MarketplaceLogService } from "./erc1155-marketplace.log.service";
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
            contractInterface: erc1155Marketplace.abi,
            // prettier-ignore
            eventNames: [
              Erc1155MarketplaceEventType.Redeem,
            ],
          },
          block: {
            startBlock: fromBlock,
          },
        };
      },
    }),
  ],
  providers: [Erc1155MarketplaceLogService, Logger],
  exports: [Erc1155MarketplaceLogService],
})
export class Erc1155MarketplaceLogModule {}
