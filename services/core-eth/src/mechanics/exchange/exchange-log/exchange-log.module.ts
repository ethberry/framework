import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, ExchangeEventType } from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

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
        const exchangeAddr = configService.get<string>("EXCHANGE_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(exchangeAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.EXCHANGE,
            contractAddress: [exchangeAddr],
            contractInterface: ExchangeSol.abi,
            // prettier-ignore
            eventNames: [
              ExchangeEventType.Purchase,
              ExchangeEventType.Claim,
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
