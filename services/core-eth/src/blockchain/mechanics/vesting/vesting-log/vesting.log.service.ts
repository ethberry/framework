import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";

@Injectable()
export class VestingLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async addListener(dto: ICreateListenerPayload): Promise<void> {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);

    await this.contractManagerService.create({
      address: dto.address.toLowerCase(),
      contractType: ContractType.VESTING,
      fromBlock: dto.fromBlock,
    });
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    return this.contractManagerService.updateLastBlockByType(ContractType.VESTING, lastBlock);
  }
}
