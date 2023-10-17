import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import type { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ModuleType } from "@framework/types";

@Injectable()
export class VestingLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<void> {
    await this.contractService.updateLastBlockByType(
      ModuleType.VESTING,
      this.ethersContractService.getLastBlockOption(),
    );
  }
}
