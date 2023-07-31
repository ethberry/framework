import { Injectable, NotFoundException } from "@nestjs/common";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractFeatures, ModuleType } from "@framework/types";

@Injectable()
export class RaffleLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
  ) {}

  public async getLastBlock(address: string): Promise<number | null> {
    const contractEntity = await this.contractService.findOne({ address });

    if (contractEntity) {
      return contractEntity.fromBlock;
    }
    return 0;
  }

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const raffleContracts = await this.contractService.findAllByType([ModuleType.RAFFLE], [ContractFeatures.RANDOM]);

    if (!raffleContracts.address) {
      throw new NotFoundException("contractNotFound");
    }

    return this.contractService.updateLastBlockByAddr(raffleContracts.address[0], lastBlock);
  }
}
