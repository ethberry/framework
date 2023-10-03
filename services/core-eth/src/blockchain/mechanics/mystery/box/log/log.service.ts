import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";
import { ModuleType } from "@framework/types";

import type { ICreateListenerPayload } from "../../../../../common/interfaces";
import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Injectable()
export class MysteryLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async updateBlock(): Promise<void> {
    await this.contractService.updateLastBlockByType(
      ModuleType.MYSTERY,
      this.ethersContractService.getLastBlockOption(),
    );
  }
}
