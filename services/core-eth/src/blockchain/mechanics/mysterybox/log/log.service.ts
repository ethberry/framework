import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
import { ICreateListenerPayload } from "../../../../common/interfaces";

@Injectable()
export class MysteryboxLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async addListener(dto: ICreateListenerPayload): Promise<void> {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);

    await this.contractManagerService.create({
      address: dto.address.toLowerCase(),
      contractType: ContractType.MYSTERYBOX,
      fromBlock: dto.fromBlock,
    });
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractManagerService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    return this.contractManagerService.updateLastBlockByType(ContractType.MYSTERYBOX, lastBlock);
  }
}
