import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";
import { ModuleType } from "@framework/types";

import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class PonziLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<void> {
    await this.contractService.updateLastBlockByType(ModuleType.PONZI, this.ethersContractService.getLastBlockOption());
  }
}
