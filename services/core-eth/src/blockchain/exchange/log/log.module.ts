import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  Erc1363EventType,
  ExchangeEventType,
  ReferralProgramEventType,
} from "@framework/types";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Exchange/Exchange.sol/Exchange.json";

import { ExchangeLogService } from "./log.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const exchangeAddr = configService.get<string>("EXCHANGE_ADDR", "");
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const fromBlock = (await contractService.getLastBlock(exchangeAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.EXCHANGE,
            contractAddress: [exchangeAddr],
            contractInterface: ExchangeSol.abi,
            // prettier-ignore
            eventNames: [
              // MODULE:PAUSE
              ContractEventType.Paused,
              ContractEventType.Unpaused,
              // MODULE:CORE
              ExchangeEventType.Purchase,
              ExchangeEventType.PaymentEthReceived,
              ExchangeEventType.PaymentEthSent,
              // MODULE:CLAIM
              ExchangeEventType.Claim,
              // MODULE:REFERRAL
              ReferralProgramEventType.ReferralProgram,
              ReferralProgramEventType.ReferralWithdraw,
              ReferralProgramEventType.ReferralReward,
              // MODULE:GRADE
              ExchangeEventType.Upgrade,
              // MODULE:BREEDING
              ExchangeEventType.Breed,
              // MODULE:PAYMENT_SPLITTER
              ExchangeEventType.PayeeAdded,
              ExchangeEventType.PaymentReceived,
              ExchangeEventType.PaymentReleased,
              ExchangeEventType.ERC20PaymentReleased,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
              // MODULE:ERC1363
              Erc1363EventType.TransferReceived,
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
  constructor(private readonly exchangeLogService: ExchangeLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.exchangeLogService.updateBlock();
  }
}
