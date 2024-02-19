import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import type { IModuleOptions } from "@gemunion/nest-js-module-ethers-gcp";
import { EthersContractModule } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractType, ModuleType, NodeEnv, PonziEventType } from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { PaymentSplitterLogService } from "./log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { getEventsTopics } from "../../../../../common/utils";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Ponzi user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
        const paymentSplitterContracts = await contractService.findAllByType([
          ModuleType.PONZI,
          ModuleType.PAYMENT_SPLITTER,
        ]);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        const eventNames = [
          PonziEventType.ERC20PaymentReleased,
          PonziEventType.PaymentEthReceived,
          PonziEventType.PaymentEthSent,
          PonziEventType.PayeeAdded,
          PonziEventType.PaymentReleased,
          PonziEventType.PaymentReceived,
        ];

        const topics = getEventsTopics(eventNames);

        return {
          contract: {
            contractType: ContractType.PAYMENT_SPLITTER,
            contractAddress: paymentSplitterContracts.address,
            contractInterface: ABI,
            topics,
          },
          block: {
            fromBlock: paymentSplitterContracts.fromBlock || startingBlock,
            debug: nodeEnv === NodeEnv.development,
            cron,
          },
        };
      },
    }),
  ],
  providers: [PaymentSplitterLogService, Logger],
  exports: [PaymentSplitterLogService],
})
export class PaymentSplitterLogModule implements OnModuleDestroy {
  constructor(private readonly paymentSplitterLogService: PaymentSplitterLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<void> {
    return this.paymentSplitterLogService.updateBlock();
  }
}
