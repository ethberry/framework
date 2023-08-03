import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ModuleType } from "@framework/types";

@Injectable()
export class WaitListLogService {
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

  public async updateBlock(): Promise<void> {
    const waitlistContracts = await this.contractService.findAllByType([ModuleType.WAITLIST]);

    if (waitlistContracts.fromBlock) {
      await this.contractService.updateLastBlockByAddr(
        waitlistContracts.address[0],
        this.ethersContractService.getLastBlockOption(),
      );
    }
  }

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }
}
