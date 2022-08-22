import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ModuleType } from "@framework/types";

import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class MysteryboxLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    return this.contractService.updateLastBlockByType(ModuleType.MYSTERYBOX, lastBlock);
  }
}
