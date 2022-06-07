import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractType, Erc20TokenEventType } from "@framework/types";

import { Erc20LogService } from "./token-log.service";

import { Erc20abi } from "./interfaces";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractManagerModule],
      inject: [ConfigService, ContractManagerService],
      useFactory: async (
        configService: ConfigService,
        contractManagerService: ContractManagerService,
      ): Promise<IModuleOptions> => {
        const erc20Contracts = await contractManagerService.findAllByType(ContractType.ERC20_TOKEN);
        return {
          contract: {
            contractType: ContractType.ERC20_TOKEN,
            contractAddress: erc20Contracts.address || [],
            contractInterface: Erc20abi,
            // prettier-ignore
            eventNames: [
              Erc20TokenEventType.Approval,
              Erc20TokenEventType.Snapshot,
              Erc20TokenEventType.Transfer,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged
            ],
          },
          block: {
            fromBlock: erc20Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [Erc20LogService, Logger],
  exports: [Erc20LogService],
})
export class Erc20TokenLogModule implements OnModuleDestroy {
  constructor(private readonly erc20LogService: Erc20LogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return await this.erc20LogService.updateBlock();
  }
}
