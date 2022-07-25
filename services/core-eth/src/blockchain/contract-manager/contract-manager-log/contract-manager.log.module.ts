import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractManagerEventType, ContractType } from "@framework/types";

// system contract
import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import { ContractManagerLogService } from "./contract-manager.log.service";
import { ContractManagerModule } from "../contract-manager.module";
import { ContractManagerService } from "../contract-manager.service";

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
        const contractManagerAddr = configService.get<string>("CONTRACT_MANAGER_ADDR", "");
        const fromBlock =
          (await contractManagerService.getLastBlock(contractManagerAddr)) ||
          ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.CONTRACT_MANAGER,
            contractAddress: [contractManagerAddr],
            contractInterface: ContractManagerSol.abi,
            // prettier-ignore
            eventNames: [
              ContractManagerEventType.VestingDeployed,
              ContractManagerEventType.ERC20TokenDeployed,
              ContractManagerEventType.ERC721TokenDeployed,
              ContractManagerEventType.ERC998TokenDeployed,
              ContractManagerEventType.ERC1155TokenDeployed
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
  providers: [ContractManagerLogService, Logger],
  exports: [ContractManagerLogService],
})
export class ContractManagerLogModule implements OnModuleDestroy {
  constructor(private readonly contractManagerLogService: ContractManagerLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.contractManagerLogService.updateBlock();
  }
}
