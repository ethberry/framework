import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { Erc20TokenEventType, ContractType } from "@framework/types";

import { Erc20LogService } from "./erc20.log.service";

// custom contracts
import { Erc20abi } from "./interfaces";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Erc20 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const erc20Contracts = await contractManagerService.findAllByType(ContractType.ERC20_CONTRACT);
        return {
          contract: {
            contractType: ContractType.ERC20_CONTRACT,
            contractAddress: erc20Contracts.address || [],
            contractInterface: Erc20abi,
            // prettier-ignore
            eventNames: [
              Erc20TokenEventType.Approval,
              Erc20TokenEventType.RoleGranted,
              Erc20TokenEventType.RoleRevoked,
              Erc20TokenEventType.Snapshot,
              Erc20TokenEventType.Transfer
            ],
          },
          block: {
            startBlock: erc20Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
          },
        };
      },
    }),
  ],
  providers: [Erc20LogService, Logger],
  exports: [Erc20LogService],
})
export class Erc20LogModule {}
