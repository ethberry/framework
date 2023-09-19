import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ModuleType } from "@framework/types";

@Injectable()
export class StakingLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async updateBlock(): Promise<void> {
    const stakingContracts = await this.contractService.findAllByType([ModuleType.STAKING]);

    if (stakingContracts.fromBlock) {
      await this.contractService.updateLastBlockByAddr(
        stakingContracts.address[0],
        this.ethersContractService.getLastBlockOption(),
      );
    }
  }

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }
}
