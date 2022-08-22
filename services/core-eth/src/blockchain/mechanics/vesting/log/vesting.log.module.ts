import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, VestingEventType } from "@framework/types";

import { VestingModule } from "../vesting.module";
import { VestingService } from "../vesting.service";
import { VestingLogService } from "./vesting.log.service";
// custom contracts
import { VestingAbi } from "./interfaces";

@Module({
  imports: [
    ConfigModule,
    VestingModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, VestingModule],
      inject: [ConfigService, VestingService],
      useFactory: async (configService: ConfigService, contractService: VestingService): Promise<IModuleOptions> => {
        const vestingContracts = await contractService.findAllContracts();
        return {
          contract: {
            contractType: ContractType.VESTING,
            contractAddress: vestingContracts.address || [],
            contractInterface: VestingAbi,
            // prettier-ignore
            eventNames: [
              VestingEventType.ERC20Released,
              VestingEventType.EtherReleased
            ],
          },
          block: {
            fromBlock: vestingContracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
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
    return await this.vestingLogService.updateBlock();
  }
}
