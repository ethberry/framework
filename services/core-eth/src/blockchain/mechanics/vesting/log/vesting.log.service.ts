import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ICreateListenerPayload } from "../../../../common/interfaces";
import { VestingService } from "../vesting.service";

@Injectable()
export class VestingLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly vestingService: VestingService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    return this.vestingService.updateLastBlock(lastBlock);
  }
}
