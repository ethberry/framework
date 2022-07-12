import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc721MarketplaceEventType } from "@framework/types";

// system contract
import MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Marketplace/Marketplace.sol/Marketplace.json";
import { Erc721MarketplaceLogService } from "./marketplace-log.service";
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
        const erc721marketAddr = configService.get<string>("MARKETPLACE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc721marketAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC721_MARKETPLACE,
            contractAddress: [erc721marketAddr],
            contractInterface: MarketplaceSol.abi,
            // prettier-ignore
            eventNames: [
              Erc721MarketplaceEventType.Redeem,
              Erc721MarketplaceEventType.RedeemDropbox
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
  providers: [Erc721MarketplaceLogService, Logger],
  exports: [Erc721MarketplaceLogService],
})
export class Erc721MarketplaceLogModule implements OnModuleDestroy {
  constructor(private readonly erc721MarketplaceLogService: Erc721MarketplaceLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc721MarketplaceLogService.updateBlock();
  }
}
