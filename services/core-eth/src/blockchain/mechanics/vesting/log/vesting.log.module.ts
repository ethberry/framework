import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, ModuleType, VestingEventType } from "@framework/types";

import { VestingModule } from "../vesting.module";
import { VestingLogService } from "./vesting.log.service";
// custom contracts
import { VestingAbi } from "./interfaces";
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
        return {
          contract: {
            contractType: ContractType.VESTING,
            contractAddress: vestingContracts.address || [],
            contractInterface: VestingAbi,
            // prettier-ignore
            eventNames: [
              VestingEventType.OwnershipTransferred,
              VestingEventType.ERC20Released,
              VestingEventType.EtherReleased,
              VestingEventType.EtherReceived,
              // MODULE:ACCESS_CONTROL
              AccessControlEventType.OwnershipTransferred,
            ],
          },
          block: {
            fromBlock: vestingContracts.fromBlock || startingBlock,
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
