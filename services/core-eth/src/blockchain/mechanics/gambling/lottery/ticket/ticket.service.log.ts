import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Erc721EventSignature, LootEventSignature, ModuleType, TokenType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../../utils/contract-type";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { LotteryTicketABI } from "./interfaces";

@Injectable()
export class LotteryTicketServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.RAFFLE,
      contractType: TokenType.ERC721,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.LOTTERY_TICKET,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: LotteryTicketABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        LootEventSignature.UnpackLootBox,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.LOTTERY_TICKET,
        contractAddress: address,
        contractInterface: LotteryTicketABI,
        eventSignatures: [
          Erc721EventSignature.Approval,
          Erc721EventSignature.ApprovalForAll,
          Erc721EventSignature.Transfer,
          LootEventSignature.UnpackLootBox,
        ],
      },
      blockNumber,
    );
  }
}
