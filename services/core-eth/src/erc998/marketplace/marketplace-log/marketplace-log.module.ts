import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, Erc998MarketplaceEventType } from "@framework/types";

// system contract
import ERC998MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";
import { Erc998MarketplaceLogService } from "./marketplace-log.service";
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
        const erc998marketAddr = configService.get<string>("ERC998_MARKETPLACE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc998marketAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.ERC998_MARKETPLACE,
            contractAddress: [erc998marketAddr],
            contractInterface: ERC998MarketplaceSol.abi,
            // prettier-ignore
            eventNames: [
              Erc998MarketplaceEventType.Redeem,
              Erc998MarketplaceEventType.RedeemDropbox
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
  providers: [Erc998MarketplaceLogService, Logger],
  exports: [Erc998MarketplaceLogService],
})
export class Erc998MarketplaceLogModule implements OnModuleDestroy {
  constructor(private readonly erc998MarketplaceLogService: Erc998MarketplaceLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc998MarketplaceLogService.updateBlock();
  }
}
