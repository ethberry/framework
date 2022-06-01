import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractManagerService } from "../contract-manager.service";

@Injectable()
export class ContractManagerLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractManagerService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }
}
