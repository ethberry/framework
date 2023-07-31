import { Injectable, NotFoundException } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ModuleType } from "@framework/types";

@Injectable()
export class WrapperLogService {
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

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const wrapperContracts = await this.contractService.findAllByType([ModuleType.WRAPPER]);

    if (!wrapperContracts.address) {
      throw new NotFoundException("contractNotFound");
    }
    return this.contractService.updateLastBlockByAddr(wrapperContracts.address[0], lastBlock);
  }
}
