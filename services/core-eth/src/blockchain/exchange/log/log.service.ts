import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ExchangeLogService {
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

  public async updateBlock(): Promise<void> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const exchangeEntity = await this.contractService.findSystemByName("Exchange");
    await this.contractService.updateLastBlockByAddr(exchangeEntity.address[0], lastBlock);
  }
}
