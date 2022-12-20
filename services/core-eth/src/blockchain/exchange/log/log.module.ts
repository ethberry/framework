import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractEventType, ContractType, ExchangeEventType, ReferralProgramEventType } from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { ExchangeLogService } from "./log.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // ContractManager
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const exchangeAddr = configService.get<string>("EXCHANGE_ADDR", "");
        const fromBlock =
          (await contractService.getLastBlock(exchangeAddr)) || ~~configService.get<string>("STARTING_BLOCK", "1");
        return {
          contract: {
            contractType: ContractType.EXCHANGE,
            contractAddress: [exchangeAddr],
            contractInterface: ExchangeSol.abi,
            // prettier-ignore
            eventNames: [
              ExchangeEventType.Purchase,
              ExchangeEventType.Claim,
              ReferralProgramEventType.ReferralProgram,
              ReferralProgramEventType.ReferralWithdraw,
              ReferralProgramEventType.ReferralReward,
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              // MODULE:BREEDING
              ExchangeEventType.Breed,
              // MODULE:WALLET
              ExchangeEventType.PayeeAdded,
              ExchangeEventType.PaymentReceived,
              ExchangeEventType.PaymentEthReceived,
              ExchangeEventType.PaymentEthSent,
              ExchangeEventType.PaymentReleased,
              ExchangeEventType.ERC20PaymentReleased,
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
