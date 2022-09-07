import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ContractManagerLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
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
    const contractManagerAddr = this.configService.get<string>("CONTRACT_MANAGER_ADDR", "");
    return this.contractService.updateLastBlockByAddr(contractManagerAddr, lastBlock);
  }
}
