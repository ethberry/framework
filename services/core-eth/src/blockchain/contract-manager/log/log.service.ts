import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { testChainId } from "@framework/constants";
import { ModuleType } from "@framework/types";

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

  public async updateBlock(): Promise<void> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractManagerEntity = await this.contractService.findSystemByName({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });
    await this.contractService.updateLastBlockByAddr(contractManagerEntity.address[0], lastBlock);
  }
}
