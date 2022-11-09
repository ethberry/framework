import { Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
import { AccessControlEventType, ContractEventType, ContractType } from "@framework/types";

// system contract
import LotteryTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721Ticket.sol/ERC721Ticket.json";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { LotteryTicketLogService } from "./log.service";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersContractModule.forRootAsync(EthersContractModule, {
      imports: [ConfigModule, ContractModule],
      inject: [ConfigService, ContractService],
      useFactory: async (configService: ConfigService, contractService: ContractService): Promise<IModuleOptions> => {
        const lotteryTicketAddr = configService.get<string>("ERC721_LOTTERY_ADDR", "");
        const fromBlock =
          (await contractService.getLastBlock(lotteryTicketAddr)) || ~~configService.get<string>("STARTING_BLOCK", "1");
        return {
          contract: {
            contractType: ContractType.LOTTERY,
            contractAddress: [lotteryTicketAddr],
            contractInterface: LotteryTicketSol.abi,
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
            fromBlock,
            debug: true,
          },
        };
      },
    }),
  ],
  providers: [LotteryTicketLogService, Logger],
  exports: [LotteryTicketLogService],
})
export class LotteryTicketLogModule implements OnModuleDestroy {
  constructor(private readonly lotteryTicketLogService: LotteryTicketLogService) {}

  // save last block on SIGTERM
  public async onModuleDestroy(): Promise<number> {
    return this.lotteryTicketLogService.updateBlock();
  }
}
