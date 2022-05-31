import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";

import { Erc20TokenEventType, ContractType } from "@framework/types";

import { Erc721LogService } from "./erc721.log.service";

// custom contracts
import { ERC721Abi } from "./interfaces";
import { ContractManagerModule } from "../../contract-manager/contract-manager.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, Erc721LogModule],
      inject: [ConfigService, Erc721LogService],
      useFactory: async (configService: ConfigService, erc721LogService: Erc721LogService): Promise<IModuleOptions> => {
        const erc721Contracts = await erc721LogService.findAllByType(ContractType.ERC721_COLLECTION);
        return {
          contract: {
            contractType: ContractType.ERC20_CONTRACT,
            contractAddress: erc721Contracts.address || [],
            contractInterface: ERC721Abi,
            // prettier-ignore
            eventNames: [
              Erc20TokenEventType.Approval,
              Erc20TokenEventType.RoleGranted,
              Erc20TokenEventType.RoleRevoked,
              Erc20TokenEventType.Snapshot,
              Erc20TokenEventType.Transfer,
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
