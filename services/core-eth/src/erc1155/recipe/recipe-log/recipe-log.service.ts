import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc1155RecipeLogService {
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
    console.info("Saved ERC1155Craft@lastBlock:", lastBlock);
    return await this.contractManagerService.updateLastBlockByType(ContractType.ERC1155_CRAFT, lastBlock);
  }
}
