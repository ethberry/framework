import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ICreateListenerPayload } from "../../../common/interfaces";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
import { IContractManagerResult } from "../../../blockchain/contract-manager/interfaces";

@Injectable()
export class Erc721TokenLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async addListener(dto: ICreateListenerPayload): Promise<void> {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);

    await this.contractManagerService.create({
      address: dto.address.toLowerCase(),
      contractType: ContractType.ERC721_TOKEN,
      fromBlock: dto.fromBlock,
    });

    // update CM: lastBlock
    await this.contractManagerService.update(
      {
        contractType: ContractType.CONTRACT_MANAGER,
      },
      { fromBlock: dto.fromBlock + 1 },
    );
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    console.info("Saved ERC721@lastBlock:", lastBlock);
    return await this.contractManagerService.updateLastBlockByType(ContractType.ERC721_TOKEN, lastBlock);
  }
}
