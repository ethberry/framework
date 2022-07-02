import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractType, VestingEventType } from "@framework/types";

import { VestingLogService } from "./vesting.log.service";

import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
// custom contracts
import { VestingAbi } from "./interfaces";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const vestingContracts = await contractManagerService.findAllByType(ContractType.VESTING);
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
export class VestingLogModule {}
