import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ContractType, ICreateListenerPayload } from "@framework/types";

import { ContractManagerService } from "../../../blockchain/contract-manager/contract-manager.service";
import { IContractManagerResult } from "../../../blockchain/contract-manager/interfaces";

@Injectable()
export class Erc721TokenLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async addListener(dto: ICreateListenerPayload): Promise<void> {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);

    await this.contractManagerService.create({
      address: dto.address.toLowerCase(),
      contractType: ContractType.ERC721_COLLECTION,
      fromBlock: dto.fromBlock,
    });

    // update CM: lastBlock
    await this.contractManagerService.update(
      {
        contractType: ContractType.CONTRACT_MANAGER,
      },
      { fromBlock: dto.fromBlock + 1 },
    );
  }

  public async getLastBlock(address: string): Promise<number | null> {
    const contractManagerEntity = await this.contractManagerService.findOne({ address });

    if (contractManagerEntity) {
      return contractManagerEntity.fromBlock;
    }
    return 0;
  }

  public async findAllByType(contractType: ContractType): Promise<IContractManagerResult> {
    const contractManagerEntities = await this.contractManagerService.findAll({ contractType });

    if (contractManagerEntities) {
      return {
        address: contractManagerEntities.map(contractManagerEntity => contractManagerEntity.address),
        fromBlock: Math.min(...contractManagerEntities.map(contractManagerEntity => contractManagerEntity.fromBlock)),
      };
    }
    return { address: [] };
  }
}
