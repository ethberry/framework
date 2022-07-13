import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, MarketplaceEventType } from "@framework/types";

// system contract
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { MarketplaceLogService } from "./marketplace.log.service";
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
        const erc1155marketAddr = configService.get<string>("MARKETPLACE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(erc1155marketAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.MARKETPLACE,
            contractAddress: [erc1155marketAddr],
            contractInterface: ExchangeSol.abi,
            // prettier-ignore
            eventNames: [
              MarketplaceEventType.RedeemCommon,
              MarketplaceEventType.RedeemDropbox,
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
  providers: [MarketplaceLogService, Logger],
  exports: [MarketplaceLogService],
})
export class MarketplaceLogModule implements OnModuleDestroy {
  constructor(private readonly erc1155MarketplaceLogService: MarketplaceLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc1155MarketplaceLogService.updateBlock();
  }
}
