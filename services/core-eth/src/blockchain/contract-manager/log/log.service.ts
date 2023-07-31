import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ContractManagerLogService {
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

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const contractManagerEntity = await this.contractService.findSystemByName("ContractManager");
    return this.contractService.updateLastBlockByAddr(contractManagerEntity.address[0], lastBlock);
  }
}
