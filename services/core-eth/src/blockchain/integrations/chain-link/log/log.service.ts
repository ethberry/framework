import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nestjs-ethers";

import { ICreateListenerPayload } from "../../../../common/interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkLogService {
  constructor(
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public addListener(dto: ICreateListenerPayload): void {
    this.ethersContractService.updateListener(dto.address, dto.fromBlock);
  }

  public async updateBlock(): Promise<number> {
    const lastBlock = this.ethersContractService.getLastBlockOption();
    const VRF = this.configService.get<string>("VRF_ADDR", "");
    return this.contractService.updateLastBlockByAddr(VRF.toLowerCase(), lastBlock);
  }
}
