import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, AccessListEventType, ContractEventType, ContractType } from "@framework/types";

import { ABI } from "./interfaces";
import { Erc20LogService } from "./token-log.service";
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
            contractInterface: ABI,
            // prettier-ignore
            eventNames: [
              ContractEventType.Approval,
              ContractEventType.Snapshot,
              ContractEventType.Transfer,
              AccessListEventType.Blacklisted,
              AccessListEventType.UnBlacklisted,
              // AccessListEventType.Whitelisted,
              // AccessListEventType.UnWhitelisted,
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
    return this.erc20LogService.updateBlock();
  }
}
