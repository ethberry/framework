import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, TokenType } from "@framework/types";

// custom contracts
import { ABI } from "./interfaces";
import { Erc1155LogService } from "./token-log.service";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    // Erc721 user contracts
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const erc1155Contracts = await contractService.findAllTokensByType(TokenType.ERC1155);
        return {
          contract: {
            contractType: ContractType.ERC1155_TOKEN,
            contractAddress: erc1155Contracts.address || [],
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractEventType.TransferSingle,
              ContractEventType.TransferBatch,
              ContractEventType.URI,
              ContractEventType.ApprovalForAll,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged
            ],
          },
          block: {
            fromBlock: erc1155Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [Erc1155LogService, Logger],
  exports: [Erc1155LogService],
})
export class Erc1155TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc1155LogService: Erc1155LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.erc1155LogService.updateBlock();
  }
}
