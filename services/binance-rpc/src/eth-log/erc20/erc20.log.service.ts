import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";
import { ICreateListenerPayload } from "./interfaces";
import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ContractType } from "@framework/types";
import { IContractManagerResult } from "../../contract-manager/interfaces";

@Injectable()
export class Erc20LogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async addListener(dto: ICreateListenerPayload): Promise<void> {
    this.ethersContractService.updateListener([dto.address], dto.fromBlock);

    await this.contractManagerService.create({
      address: dto.address[0].toLowerCase(),
      contractType: ContractType.ERC20_CONTRACT,
      fromBlock: dto.fromBlock || 0,
    });

    // update CM: lastBlock = ctx.block + 1
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
