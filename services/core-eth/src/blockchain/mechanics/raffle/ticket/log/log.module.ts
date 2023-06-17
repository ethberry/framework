import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";
import { Interface } from "ethers";

import { EthersContractModule } from "@gemunion/nestjs-ethers";
import type { IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType, ModuleType } from "@framework/types";
import RaffleTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { RaffleTicketLogService } from "./log.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const raffleTicketAddr = await contractService.findAllByType([ModuleType.RAFFLE], []);

        const startingBlock = ~~configService.get<string>("STARTING_BLOCK", "1");
        const cron =
          Object.values(CronExpression)[
            Object.keys(CronExpression).indexOf(configService.get<string>("CRON_SCHEDULE", "EVERY_30_SECONDS"))
          ];

        return {
          contract: {
            contractType: ContractType.RAFFLE,
            contractAddress: raffleTicketAddr.address || [],
            contractInterface: new Interface(RaffleTicketSol.abi),
            // prettier-ignore
            eventNames: [
              // TODO add other events
              ContractEventType.Transfer,
              AccessControlEventType.RoleGranted,
              AccessControlEventType.RoleRevoked,
              AccessControlEventType.RoleAdminChanged,
              ContractEventType.TokenRoyaltyInfo,
              ContractEventType.Approval,
              ContractEventType.ApprovalForAll,
              ContractEventType.DefaultRoyaltyInfo,
            ],
          },
          block: {
            fromBlock: raffleTicketAddr.fromBlock || startingBlock,
            debug: false,
            cron,
          },
        };
      },
    }),
  ],
  providers: [RaffleTicketLogService, Logger],
  exports: [RaffleTicketLogService],
})
export class RaffleTicketLogModule implements OnModuleDestroy {
  constructor(private readonly raffleTicketLogService: RaffleTicketLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.raffleTicketLogService.updateBlock();
  }
}
