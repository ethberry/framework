import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, Erc1363EventType, ModuleType, VestingEventType } from "@framework/types";

import { VestingModule } from "../vesting.module";
import { VestingLogService } from "./vesting.log.service";
// custom contracts
import { VestingInterface } from "./interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    VestingModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const vestingContracts = await contractService.findAllByType(ModuleType.VESTING);
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];
        return {
          contract: {
            contractType: ContractType.VESTING,
            contractAddress: vestingContracts.address || [],
            contractInterface: VestingInterface,
            // prettier-ignore
            eventNames: [
              VestingEventType.ERC20Released,
              VestingEventType.EtherReleased,
              // VestingEventType.EtherReceived,
              VestingEventType.PaymentEthReceived,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.OwnershipTransferred,
              // MODULE:ERC1363
              Erc1363EventType.TransferReceived
            ],
          },
          block: {
            fromBlock: vestingContracts.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [VestingLogService, Logger],
  exports: [VestingLogService],
})
export class VestingLogModule implements OnModuleDestroy {
  constructor(private readonly vestingLogService: VestingLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.vestingLogService.updateBlock();
  }
}
