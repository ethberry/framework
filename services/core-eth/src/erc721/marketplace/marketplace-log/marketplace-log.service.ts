import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType } from "@framework/types";

import { ICreateListenerPayload } from "../../../common/interfaces";
import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc721MarketplaceLogService {
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

  public async updateLastBlock(dto: ICreateListenerPayload): Promise<void> {
    // update CM: lastBlock
    await this.contractManagerService.update(
      {
        contractType: ContractType.ERC721_MARKETPLACE,
      },
      { fromBlock: dto.fromBlock + 1 },
    );
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const entity = await this.contractManagerService.update(
      {
        contractType: ContractType.ERC721_MARKETPLACE,
      },
      { fromBlock: lastBlock + 1 },
    );
    console.info("Saved Erc721Marketplace@lastBlock:", entity.fromBlock);
    return entity.id;
  }
}
