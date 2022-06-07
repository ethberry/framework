import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc721DropboxLogService {
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
    console.info("Saved Erc721Dropbox@lastBlock:", lastBlock);
    return await this.contractManagerService.updateLastBlockByType(ContractType.ERC721_DROPBOX, lastBlock);
  }
}
