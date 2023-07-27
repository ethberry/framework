import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class WrapperLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
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
    const wrapperAddr = this.configService.get<string>("ERC721_WRAPPER_ADDR", "");
    return this.contractService.updateLastBlockByAddr(wrapperAddr, lastBlock);
  }
}
