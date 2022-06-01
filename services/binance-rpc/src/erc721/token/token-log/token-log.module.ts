import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { AccessControlEventType, ContractType, Erc20TokenEventType } from "@framework/types";

import { Erc721TokenLogService } from "./token-log.service";

// custom contracts
import { ERC721Abi } from "./interfaces";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

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
        const erc721Contracts = await contractManagerService.findAllByType(ContractType.ERC721_COLLECTION);
        return {
          contract: {
            contractType: ContractType.ERC721_COLLECTION,
            contractAddress: erc721Contracts.address || [],
            contractInterface: ERC721Abi,
            // prettier-ignore
            // TODO process accessControl events
            eventNames: [
              Erc20TokenEventType.Approval,
              Erc20TokenEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              Erc20TokenEventType.Snapshot,
              Erc20TokenEventType.Transfer
            ],
          },
          block: {
            fromBlock: erc721Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
          },
        };
      },
    }),
  ],
  providers: [Erc721TokenLogService, Logger],
  exports: [Erc721TokenLogService],
})
export class Erc721TokenLogModule {}
