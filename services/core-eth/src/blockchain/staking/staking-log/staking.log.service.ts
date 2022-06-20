import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ContractType } from "@framework/types";

@Injectable()
export class StakingLogService {
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

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    console.info("Saved Staking@lastBlock:", lastBlock);
    return await this.contractManagerService.updateLastBlockByType(ContractType.STAKING, lastBlock);
  }
}
