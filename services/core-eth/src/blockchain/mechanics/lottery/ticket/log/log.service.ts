import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryTicketLogService {
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
    const lotteryAddr = this.configService.get<string>("LOTTERY_ADDR", "");
    return this.contractService.updateLastBlockByAddr(lotteryAddr, lastBlock);
  }
}
