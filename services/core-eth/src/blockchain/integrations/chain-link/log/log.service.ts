import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractFeatures, ModuleType } from "@framework/types";
import { abiEncode, keccak256It } from "../utils";
import { ChainLinkEventSignatures } from "./interfaces";

@Injectable()
export class ChainLinkLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async updateListener(): Promise<void> {
    const randomContracts = await this.getAllRandomContracts();
    if (randomContracts) {
      const topics = [
        keccak256It(ChainLinkEventSignatures.RandomWordsRequested as string),
        null,
        null,
        [...new Set(randomContracts?.map(addr => abiEncode(addr, "address")))],
      ];
      this.ethersContractService.updateListener([], 0, topics);
    }
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const VRF = this.configService.get<string>("VRF_ADDR", "");
    return this.contractService.updateLastBlockByAddr(VRF.toLowerCase(), lastBlock);
  }

  public async getAllRandomContracts(): Promise<string[] | undefined> {
    const randomTokens = await this.contractService.findAllTokensByType(void 0, [
      ContractFeatures.RANDOM,
      ContractFeatures.GENES,
    ]);
    const lotteryContracts = await this.contractService.findAllByType(
      [ModuleType.LOTTERY, ModuleType.RAFFLE],
      [ContractFeatures.RANDOM],
    );
    return randomTokens.address?.concat(lotteryContracts.address || []);
  }
}
