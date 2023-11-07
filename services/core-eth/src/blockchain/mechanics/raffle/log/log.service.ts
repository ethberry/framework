import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import type { ICreateListenerPayload } from "../../../../common/interfaces";
import { ModuleType } from "@framework/types";

@Injectable()
export class RaffleLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public async getLastBlock(address: string): Promise<number | null> {
    const contractEntity = await this.contractService.findOne({ address });

    if (contractEntity) {
      return contractEntity.fromBlock;
    }
    return 0;
  }

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<void> {
    await this.contractService.updateLastBlockByModuleTypeRandom(
      ModuleType.RAFFLE,
      this.ethersContractService.getLastBlockOption(),
    );
  }
}
