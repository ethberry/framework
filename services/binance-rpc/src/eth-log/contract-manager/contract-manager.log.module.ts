import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { ContractManagerEventType, ContractType } from "@framework/types";

// system contract
import ContractManagerSol from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import { ContractManagerLogService } from "./contract-manager.log.service";
import { ContractManagerModule } from "../../contract-manager/contract-manager.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // ContractManager
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
        // contractManagerLogService: ContractManagerLogService,
      ): IModuleOptions => {
        const contractManagerAddr = configService.get<string>("CONTRACT_MANAGER_ADDR", "");
        console.log("contractManagerAddr", contractManagerAddr);
        const fromBlock = ~~configService.get<string>("STARTING_BLOCK", "0");
        // const fromBlock =
        //   (await contractManagerLogService.getLastBlock(contractManagerAddr)) ||
        //   ~~configService.get<string>("STARTING_BLOCK", "0");
        return {
          contract: {
            contractType: ContractType.CONTRACT_MANAGER,
            contractAddress: [contractManagerAddr],
            contractInterface: ContractManagerSol.abi,
            // prettier-ignore
            eventNames: [
              ContractManagerEventType.ERC20VestingDeployed,
              ContractManagerEventType.ERC20TokenDeployed,
              ContractManagerEventType.ERC721TokenDeployed,
              ContractManagerEventType.ERC1155TokenDeployed,
            ],
          },
          block: {
            startBlock: fromBlock,
          },
        };
      },
    }),
  ],
  providers: [ContractManagerLogService, Logger],
  exports: [ContractManagerLogService],
})
export class ContractManagerLogModule {}
