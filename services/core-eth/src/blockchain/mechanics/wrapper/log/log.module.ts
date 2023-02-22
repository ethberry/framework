import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType } from "@framework/types";

import { WrapperLogService } from "./log.service";

// system contract
import WrapperSol from "@framework/core-contracts/artifacts/contracts/Mechanics/TokenWrapper/ERC721Wrapper.sol/ERC721Wrapper.json";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const wrapperAddr = configService.get<string>("ERC721_WRAPPER_ADDR", "");
        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const fromBlock = (await contractService.getLastBlock(wrapperAddr)) || startingBlock;
        return {
          contract: {
            contractType: ContractType.WRAPPER,
            contractAddress: [wrapperAddr],
            contractInterface: WrapperSol.abi,
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Transfer,
              ContractEventType.UnpackWrapper,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
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
  providers: [WrapperLogService, Logger],
  exports: [WrapperLogService],
})
export class WrapperLogModule implements OnModuleDestroy {
  constructor(private readonly wrapperLogService: WrapperLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.wrapperLogService.updateBlock();
  }
}
