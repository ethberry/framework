import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { Erc20TokenEventType, ContractType, AccessControlEventType } from "@framework/types";

import { Erc721LogService } from "./erc721.log.service";

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
            startBlock: erc721Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
          },
        };
      },
    }),
  ],
  providers: [Erc721LogService, Logger],
  exports: [Erc721LogService],
})
export class Erc721LogModule {}
