import { Injectable } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ICreateListenerPayload } from "./interfaces";
import { ContractType } from "@framework/types";
import { IContractManagerResult } from "../../contract-manager/interfaces";

@Injectable()
export class ContractManagerLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
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
