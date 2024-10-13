import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { LotteryEventType, ModuleType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../../utils/contract-type";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { LotteryABI } from "./interfaces";

@Injectable()
export class LotteryRoundServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.LOTTERY,
      contractType: IsNull(),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.LOTTERY,
      contractAddress: address,
      contractInterface: LotteryABI,
      eventSignatures: [
        LotteryEventType.Prize,
        LotteryEventType.RoundEnded,
        LotteryEventType.Released,
        LotteryEventType.RoundStarted,
        LotteryEventType.RoundFinalized,
      ],
    });
  }
}
